#!/bin/bash
set -e

echo "========================================================"
echo "  🕉️  Happy Shambala — 1-Click Mac App Store Builder"
echo "========================================================"

# Ensure we are inside the repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Check Xcode
if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "❌ Xcode is not installed. Please install Xcode from the Mac App Store first, open it once to accept the license, and re-run this script."
  exit 1
fi

echo "✅ Xcode found: $(xcodebuild -version | head -n 1)"

# 2. Check / Install Flutter if not in PATH
if ! command -v flutter >/dev/null 2>&1; then
  if [ -d "$HOME/development/flutter/bin" ]; then
    export PATH="$HOME/development/flutter/bin:$PATH"
  elif [ -d "/opt/homebrew/Caskroom/flutter" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
  else
    echo "📦 Flutter not found in PATH. Installing Flutter via Homebrew..."
    if ! command -v brew >/dev/null 2>&1; then
      echo "❌ Homebrew not found. Install Flutter from https://docs.flutter.dev/get-started/install/macos and re-run."
      exit 1
    fi
    brew install --cask flutter
  fi
fi

echo "✅ Flutter found: $(flutter --version | head -n 1)"

# 3. Check / Install CocoaPods
if ! command -v pod >/dev/null 2>&1; then
  echo "📦 Installing CocoaPods..."
  if command -v brew >/dev/null 2>&1; then
    brew install cocoapods
  else
    sudo gem install cocoapods
  fi
fi

echo "✅ CocoaPods found: $(pod --version)"

# 4. Pull latest changes & build iOS workspace
cd "$SCRIPT_DIR/shambala_flutter"
echo "🔄 Fetching Flutter packages & precaching iOS artifacts..."
flutter clean
flutter pub get
flutter precache --ios

echo "🔨 Generating iOS Release Pods & Workspace (v1.1.1 build 12)..."
flutter build ios --release --no-codesign --build-name=1.1.1 --build-number=12

echo ""
echo "========================================================"
echo "  🎉 SUCCESS! Opening Xcode & App Store Assets Folder..."
echo "========================================================"
echo "Next 4 clicks inside Xcode:"
echo "  1. Click 'Runner' (left sidebar) -> 'Signing & Capabilities' tab"
echo "  2. Check 'Automatically manage signing' & pick your Apple Team"
echo "  3. Set Bundle Identifier (e.g. org.happyshambala.music)"
echo "  4. Top bar: select 'Any iOS Device (arm64)' -> Product -> Archive -> Distribute App!"
echo "========================================================"

open "$SCRIPT_DIR/appstore_assets"
open "$SCRIPT_DIR/shambala_flutter/ios/Runner.xcworkspace"
