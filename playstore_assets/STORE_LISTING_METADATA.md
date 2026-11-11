# Google Play Console — Store Listing & Upload Guide (`v1.0.2+3`)

## 1. Release Binaries (`playstore_assets/releases/`)
- **Google Play Store App Bundle (AAB)** *(Upload this to Play Console → Production / Internal Testing)*:
  - `e:\Shambala_Music\playstore_assets\releases\Shambala_Music_v1.0.2+3_release.aab`
  - Also at: `e:\Shambala_Music\shambala_flutter\build\app\outputs\bundle\release\app-release.aab`
- **Universal Release APK** *(For direct installation / sideloading / testing)*:
  - `e:\Shambala_Music\playstore_assets\releases\Shambala_Music_v1.0.2+3_release.apk`
  - Also at: `e:\Shambala_Music\shambala_flutter\build\app\outputs\flutter-apk\app-release.apk`

---

## 2. Visual Graphics (`playstore_assets/`)

| Asset Type | Dimensions | File Path |
| :--- | :--- | :--- |
| **App Icon** | `512 x 512 px` (32-bit PNG) | `e:\Shambala_Music\playstore_assets\app_icon_512x512.png` |
| **Feature Graphic (Main v1.0.2)** | `1024 x 500 px` (PNG) | `e:\Shambala_Music\playstore_assets\feature_graphic_1024x500_main.png` |
| **Feature Graphic (Option 1)** | `1024 x 500 px` (PNG) | `e:\Shambala_Music\playstore_assets\feature_graphic_1024x500_option1.png` |
| **Feature Graphic (Option 2)** | `1024 x 500 px` (PNG) | `e:\Shambala_Music\playstore_assets\feature_graphic_1024x500_option2.png` |
| **Phone Screenshot 1** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\01_home_divine_music.png` |
| **Phone Screenshot 2** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\02_noon_meditation_scheduler.png` |
| **Phone Screenshot 3** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\03_six_sacred_themes.png` |
| **Phone Screenshot 4** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\04_live_satsang_podcasts.png` |
| **Phone Screenshot 5** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\05_profile_analytics_sync.png` |
| **Phone Screenshot 6** | `1080 x 1920 px` (9:16 PNG) | `e:\Shambala_Music\playstore_assets\phone_screenshots\06_offline_downloads_player.png` |
| **Tablet Screenshot 1 (7" & 10")** | `1920 x 1200 px` (16:10 PNG) | `e:\Shambala_Music\playstore_assets\tablet_screenshots\01_tablet_dashboard_home.png` |
| **Tablet Screenshot 2 (7" & 10")** | `1920 x 1200 px` (16:10 PNG) | `e:\Shambala_Music\playstore_assets\tablet_screenshots\02_tablet_themes_and_analytics.png` |

---

## 3. Copy-Paste Store Listing Text

### App Name (Max 30 characters)
```text
Happy Shambala: Divine Music
```

### Short Description (Max 80 characters)
```text
Divine Mantras, Bhajans, 24/7 Live Satsang & Daily 12:00 PM Global Meditation.
```

### Full Description (Max 4000 characters)
```text
Awaken your inner peace with Happy Shambala (Awakening Avadhanies) — a 100% free, ad-free devotional music, mantra chanting, and daily meditation sanctuary.

Whether you seek morning Vedic chants, sacred Mahalakshmi and Ganesha Tapas, 432Hz/528Hz healing soundscapes, or a synchronized daily meditation habit, Happy Shambala brings timeless spiritual vibrations right to your phone.

✨ KEY FEATURES:

🕉️ Automated 12:00 PM Global Noon Meditation
Join thousands of seekers every day at 12:00 PM sharp for a 6-minute guided divine sound meditation. Each day of the week is dedicated to a sacred deity and mantra:
• Monday — Lord Shiva (Om Namah Shivaya)
• Tuesday — Lord Ganesha (Om Gam Ganapataye Namaha)
• Wednesday — Lord Krishna (Om Namo Bhagavate Vasudevaya)
• Thursday — Guru Dakshinamurthy
• Friday — Devi Mahalakshmi (Om Shreem Mahalakshmiyei Namaha)
• Saturday — Lord Hanuman & Shani Peace Mantras
• Sunday — Surya Narayana Gayatri Mantra

🎨 6 Sacred App Theme Color Schemes
Personalize your spiritual space with 6 handcrafted color palettes reflected across every screen:
• Divine Light (Warm Cream, Imperial Gold & Crimson)
• Midnight Divine (Deep Cosmic Plum & Solar Gold)
• Sacred Saffron (Vedic Marigold & Temple Terracotta)
• Vrindavan Emerald (Peacock Teal & Bansuri Flute Gold)
• Kailash Sapphire (Himalayan Blue & Silver Cyan)
• Lotus Rose Bliss (Mahalakshmi Rose & Pearl Light)

📻 24/7 Live Satsang & Spiritual Podcasts
Tune in to non-stop live devotional broadcasts, participate in the live community sangha chat, and listen to spiritual podcasts on the Bhagavad Gita, Upanishads, and Vedic wisdom.

📥 Offline Downloads & Sacred Lyrics
Download your favorite bhajans, mantras, and meditation tracks for offline listening during travel or silent retreats. View synchronized mantras and lyrics, and set a customizable Sleep Timer (15, 30, 45, or 60 minutes).

🔐 Seamless Multi-Option Sign-In & Devotional Analytics
Track your daily chanting streak, meditation minutes, total listening hours, and top deity focus. Sign in effortlessly using Google, Email & Password, WhatsApp/Phone OTP, Apple ID, or continue in 100% Free Guest Mode.

100% Free Forever • Zero Ads • Built for Spiritual Seekers Worldwide.
```

---

## 4. Release Notes (`What's new in v1.0.2+3`)
```text
• Added 6 Sacred App Theme Color Schemes (Divine Light, Midnight Divine, Sacred Saffron, Vrindavan Emerald, Kailash Sapphire, and Lotus Rose Bliss) reflected dynamically across all screens.
• Added streamlined dropdown selectors for Sign-In & Sync Options (Google, Email, WhatsApp/Phone OTP, Apple ID, and Guest Mode) and App Theme Color Schemes.
• Fixed UI layout alignment on smaller screens and enhanced 12:00 PM Noon Meditation scheduling stability.
```

---

## 5. App Category & Store Settings
- **Application Type**: App
- **Category**: Music & Audio (or Health & Fitness / Lifestyle)
- **Tags**: Devotional Music, Mantras, Meditation, Bhajans, Spiritual
- **Content Rating**: Everyone (PEGI 3 / ESRB Everyone)
- **Ads Declaration**: No, my app does not contain ads
- **Target Audience**: 13+ / General Audience
- **Privacy Policy File**: Included in repository at `e:\Shambala_Music\public\privacy.html` and `e:\Shambala_Music\shambala_flutter\PRIVACY_POLICY.md`

