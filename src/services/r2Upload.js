// Cloudflare R2 Upload Service (S3 SigV4 Native WebCrypto Implementation)

// Helper: Convert ArrayBuffer to Hex String
function buf2hex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: HMAC SHA-256 using native crypto.subtle
async function hmacSha256(key, data) {
  const cryptoKey = typeof key === 'string'
    ? await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(key),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
    : await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

// Helper: SHA-256 Hash using native crypto.subtle
async function sha256Hex(data) {
  const encoded = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return buf2hex(hash);
}

// Format ISO date strings for S3 SigV4
function getAmzDates() {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
  const dateStamp = amzDate.substring(0, 8);
  return { amzDate, dateStamp };
}

// Extract Audio Duration & Metadata
export const getAudioMetadata = (file) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.src = objectUrl;
    audio.onloadedmetadata = () => {
      const durationSec = Math.round(audio.duration || 0);
      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      URL.revokeObjectURL(objectUrl);
      resolve({ durationSec, formattedDuration });
    };

    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ durationSec: 300, formattedDuration: '05:00' });
    };
  });
};

// Main Function: Upload File to Cloudflare R2
export const uploadToR2 = async ({
  file,
  config,
  folder = 'audio',
  onProgress
}) => {
  const { accountId, bucketName, accessKeyId, secretAccessKey, publicDomain } = config || {};

  // If no Cloudflare credentials configured, simulate R2 upload for local testing
  if (!accountId || !bucketName || !accessKeyId || !secretAccessKey) {
    console.warn('Cloudflare R2 credentials missing. Creating local preview object URL...');
    let progress = 0;
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 80));
      progress = i * 10;
      if (onProgress) onProgress(progress);
    }

    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      isSimulated: true,
      url: localUrl,
      key: `${folder}/${Date.now()}_${file.name}`,
      message: 'Uploaded in Demo Mode (Configure R2 Credentials in Admin Panel for live Cloudflare R2 storage)'
    };
  }

  // Construct Clean Object Key
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectKey = `${folder}/${timestamp}_${safeFileName}`;

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = 'auto';
  const service = 's3';

  const { amzDate, dateStamp } = getAmzDates();
  const contentType = file.type || 'application/octet-stream';

  // Calculate Payload Hash (SHA-256 of file bytes)
  const fileArrayBuffer = await file.arrayBuffer();
  const payloadHash = await sha256Hex(fileArrayBuffer);

  // Canonical Request setup
  const canonicalUri = `/${bucketName}/${objectKey}`;
  const canonicalQueryString = '';
  
  const headers = {
    'content-type': contentType,
    'host': host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate
  };

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  // String to Sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = await sha256Hex(canonicalRequest);

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash
  ].join('\n');

  // Calculate Signing Key
  const kDate = await hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');

  // Calculate Signature
  const signatureBytes = await hmacSha256(kSigning, stringToSign);
  const signature = buf2hex(signatureBytes);

  // Authorization Header
  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // Execute Direct PUT Request to Cloudflare R2
  const endpointUrl = `https://${host}/${bucketName}/${objectKey}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', endpointUrl, true);

    xhr.setRequestHeader('Content-Type', contentType);
    xhr.setRequestHeader('x-amz-date', amzDate);
    xhr.setRequestHeader('x-amz-content-sha256', payloadHash);
    xhr.setRequestHeader('Authorization', authorizationHeader);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Construct Public URL
        let publicUrl = '';
        if (publicDomain && publicDomain.trim()) {
          const cleanDomain = publicDomain.trim().replace(/\/$/, '');
          publicUrl = `${cleanDomain}/${objectKey}`;
        } else {
          publicUrl = `https://pub-${accountId.substring(0, 8)}.r2.dev/${objectKey}`;
        }

        resolve({
          success: true,
          isSimulated: false,
          url: publicUrl,
          key: objectKey,
          status: xhr.status
        });
      } else {
        console.error('R2 Upload Failed:', xhr.status, xhr.responseText);
        reject(new Error(`Cloudflare R2 Upload Failed (${xhr.status}). Ensure CORS rule is configured on your R2 bucket.`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error or CORS policy blocked R2 upload. Check bucket CORS settings in Cloudflare Dashboard.'));
    };

    xhr.send(fileArrayBuffer);
  });
};

// Generate CORS Rule JSON template for Cloudflare R2 dashboard
export const getRecommendedR2CorsRule = (origin = '*') => {
  return JSON.stringify([
    {
      "AllowedOrigins": [origin],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ], null, 2);
};
