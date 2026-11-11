# Apple App Store Connect — Upload & Listing Guide (`v1.0.2+3`)

## 1. How to Build the iOS `.ipa` Package (From Windows or Mac)
Because Apple requires **macOS + Xcode** to compile and sign iOS `.ipa` binaries, you cannot run `flutter build ipa` directly on Windows. We have configured your iOS project ([Info.plist](file:///e:/Shambala_Music/shambala_flutter/ios/Runner/Info.plist) and non-transparent [AppIcon.appiconset](file:///e:/Shambala_Music/shambala_flutter/ios/Runner/Assets.xcassets/AppIcon.appiconset/Contents.json)) and created two ready-to-use cloud build configurations so you can generate the `.ipa` without needing a Mac:

### Option A: Automated Cloud Build via GitHub Actions (`.github/workflows/ios_release_ipa.yml`)
1. Push this repository to GitHub.
2. Go to the **Actions** tab → **Build iOS Release IPA** → click **Run workflow**.
3. The macOS runner (`macos-latest`) compiles the iOS release archive and uploads **`Shambala_Music_v1.0.2+3_unsigned.ipa`** (or signed `.ipa` with your Apple Developer certificate secrets) directly as a downloadable artifact.

### Option B: One-Click Cloud Build & TestFlight Upload via Codemagic (`shambala_flutter/codemagic.yaml`)
1. Sign in to [Codemagic.io](https://codemagic.io) (free macOS build minutes included) and connect your repository.
2. Codemagic automatically detects `shambala_flutter/codemagic.yaml`, signs the app with your Apple Developer account, and uploads the `.ipa` directly to **App Store Connect / TestFlight**.

### Option C: If Running on a Mac
```bash
cd shambala_flutter
flutter build ipa --release
# Output: build/ios/ipa/shambala_flutter.ipa
```

---

## 2. Apple App Store Visual Assets (`e:\Shambala_Music\appstore_assets\`)

| Display / Asset Type | Exact Dimensions | Folder / File Path |
| :--- | :--- | :--- |
| **App Store Icon (24-bit RGB, No Alpha)** | `1024 x 1024 px` | `e:\Shambala_Music\appstore_assets\app_store_icon_1024x1024_no_alpha.png` |
| **Xcode iOS AppIconSet (15 sizes, No Alpha)** | `20px` – `1024px` | `e:\Shambala_Music\shambala_flutter\ios\Runner\Assets.xcassets\AppIcon.appiconset\` |
| **iPhone 6.7" Display** *(iPhone 15/16 Pro Max — Required)* | `1290 x 2796 px` (6 PNGs) | `e:\Shambala_Music\appstore_assets\iphone_6.7_inch_1290x2796\` |
| **iPhone 6.5" Display** *(iPhone 11 Pro Max / XS Max)* | `1242 x 2688 px` (6 PNGs) | `e:\Shambala_Music\appstore_assets\iphone_6.5_inch_1242x2688\` |
| **iPhone 5.5" Display** *(iPhone 8 Plus)* | `1242 x 2208 px` (6 PNGs) | `e:\Shambala_Music\appstore_assets\iphone_5.5_inch_1242x2208\` |
| **iPad Pro 12.9" / 13" Display** *(Required for iPad)* | `2732 x 2048 px` (2 PNGs) | `e:\Shambala_Music\appstore_assets\ipad_pro_12.9_inch\` |

---

## 3. Copy-Paste App Store Connect Listing Metadata

### App Name (Max 30 characters)
```text
Happy Shambala: Divine Music
```

### Subtitle (Max 30 characters)
```text
Mantras, Bhajans & Meditation
```

### Promotional Text (Max 170 characters)
```text
Experience 100% free sacred Vedic mantras, bhajans, 24/7 live satsang, 6 divine app color themes, and our daily 12:00 PM synchronized global meditation—with zero ads!
```

### Keywords (Max 100 characters, comma-separated, no spaces after commas)
```text
mantra,bhajan,meditation,devotional,hindu,chants,spiritual,satsang,vedic,shiva,krishna,ganesha,yoga
```

### Description (Max 4000 characters)
```text
Awaken your inner peace with Happy Shambala (Awakening Avadhanies) — a 100% free, ad-free devotional music, mantra chanting, and daily meditation sanctuary for iPhone and iPad.

Whether you seek morning Vedic chants, sacred Mahalakshmi and Ganesha Tapas, 432Hz/528Hz healing soundscapes, or a synchronized daily meditation habit, Happy Shambala brings timeless spiritual vibrations right to your iOS device.

KEY FEATURES:

• Automated 12:00 PM Global Noon Meditation
Join thousands of seekers every day at 12:00 PM sharp for a 6-minute guided divine sound meditation. Each day of the week is dedicated to a sacred deity and mantra:
- Monday: Lord Shiva (Om Namah Shivaya)
- Tuesday: Lord Ganesha (Om Gam Ganapataye Namaha)
- Wednesday: Lord Krishna (Om Namo Bhagavate Vasudevaya)
- Thursday: Guru Dakshinamurthy
- Friday: Devi Mahalakshmi (Om Shreem Mahalakshmiyei Namaha)
- Saturday: Lord Hanuman & Shani Peace Mantras
- Sunday: Surya Narayana Gayatri Mantra

• 6 Sacred App Theme Color Schemes
Personalize your spiritual space with 6 handcrafted color palettes reflected across every screen:
- Divine Light (Warm Cream, Imperial Gold & Crimson)
- Midnight Divine (Deep Cosmic Plum & Solar Gold)
- Sacred Saffron (Vedic Marigold & Temple Terracotta)
- Vrindavan Emerald (Peacock Teal & Bansuri Flute Gold)
- Kailash Sapphire (Himalayan Blue & Silver Cyan)
- Lotus Rose Bliss (Mahalakshmi Rose & Pearl Light)

• 24/7 Live Satsang & Spiritual Podcasts
Tune in to non-stop live devotional broadcasts, participate in the live community sangha chat, and listen to spiritual podcasts on the Bhagavad Gita, Upanishads, and Vedic wisdom.

• Offline Downloads, Background Audio & Sacred Lyrics
Download your favorite bhajans, mantras, and meditation tracks for offline listening during travel or silent retreats. Supports full iOS background audio playback, lock-screen controls, synchronized lyrics, and a customizable Sleep Timer (15, 30, 45, or 60 minutes).

• Sign in with Apple & Devotional Analytics
Track your daily chanting streak, meditation minutes, total listening hours, and top deity focus. Sign in effortlessly using Sign in with Apple, Google, Email & Password, WhatsApp/Phone OTP, or continue in 100% Free Guest Mode.
```

### What's New in This Version (`v1.0.2`, Build `3`)
```text
• Added 6 Sacred App Theme Color Schemes (Divine Light, Midnight Divine, Sacred Saffron, Vrindavan Emerald, Kailash Sapphire, and Lotus Rose Bliss) reflected dynamically across all screens.
• Added streamlined dropdown selectors for Sign-In & Sync Options (including Sign in with Apple, Google, Email, WhatsApp OTP, and Guest Mode) and App Theme Color Schemes.
• Enhanced iOS background audio playback and 12:00 PM Noon Meditation scheduling.
```

---

## 4. App Store Connect Configuration & Review Notes
- **Bundle ID**: `com.shambala.divine.shambalaFlutter` (or `com.Shambala_Music` as configured in your Apple Developer portal)
- **Version**: `1.0.2` (Build `3`)
- **Primary Category**: Music
- **Secondary Category**: Health & Fitness (or Lifestyle)
- **Age Rating**: `4+` (No objectionable content)
- **Export Compliance (`ITSAppUsesNonExemptEncryption`)**: Already set to `false` in `ios/Runner/Info.plist` so TestFlight builds approve automatically without export compliance prompts.
- **Sign in with Apple**: Supported natively alongside Guest Mode (`100% Free`).

