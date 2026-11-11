// IndexedDB Database Service for Offline Songs & Playlists

const DB_NAME = 'ShambalaDivineMusicDB';
const DB_VERSION = 1;
const STORE_OFFLINE_TRACKS = 'offline_tracks';
const STORE_PLAYLISTS = 'playlists';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_OFFLINE_TRACKS)) {
        db.createObjectStore(STORE_OFFLINE_TRACKS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_PLAYLISTS)) {
        db.createObjectStore(STORE_PLAYLISTS, { keyPath: 'id' });
      }
    };
  });
};

// Save track to IndexedDB for offline play
export const saveOfflineTrack = async (track, audioBlobUrlOrData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OFFLINE_TRACKS, 'readwrite');
    const store = tx.objectStore(STORE_OFFLINE_TRACKS);

    const offlineItem = {
      ...track,
      downloadedAt: new Date().toISOString(),
      audioData: audioBlobUrlOrData,
      isDownloaded: true
    };

    const request = store.put(offlineItem);
    request.onsuccess = () => resolve(offlineItem);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Get all offline tracks
export const getOfflineTracks = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_TRACKS, 'readonly');
      const store = tx.objectStore(STORE_OFFLINE_TRACKS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to fetch offline tracks', err);
    return [];
  }
};

// Delete offline track
export const removeOfflineTrack = async (trackId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OFFLINE_TRACKS, 'readwrite');
    const store = tx.objectStore(STORE_OFFLINE_TRACKS);
    const request = store.delete(trackId);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Check if track is downloaded
export const isTrackDownloaded = async (trackId) => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_OFFLINE_TRACKS, 'readonly');
    const store = tx.objectStore(STORE_OFFLINE_TRACKS);
    const request = store.get(trackId);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });
};
