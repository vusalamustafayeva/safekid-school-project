#!/bin/bash

# SafeKid APK Build Script
# This script helps you build all three Android APKs

set -e

echo "========================================"
echo "SafeKid Android APK Build Script"
echo "========================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js and npm first"
    exit 1
fi

echo "✓ npm found"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
fi

echo ""
echo "========================================"
echo "Step 1: Building Web Apps"
echo "========================================"
echo ""

echo "Building Child App..."
npm run build:child
echo "✓ Child app built → dist-child/"

echo ""
echo "Building Parent App..."
npm run build:parent
echo "✓ Parent app built → dist-parent/"

echo ""
echo "Building School App..."
npm run build:school
echo "✓ School app built → dist-school/"

echo ""
echo "========================================"
echo "Step 2: Capacitor Setup"
echo "========================================"
echo ""

# Check if Android platform exists
if [ ! -d "android" ]; then
    echo "Android platform not found. Setting up..."
    echo ""

    echo "Do you want to build APKs locally or using cloud build?"
    echo "1) Local build (requires Android Studio)"
    echo "2) Cloud build with EAS (no Android Studio needed)"
    echo ""
    read -p "Enter choice (1 or 2): " choice

    if [ "$choice" = "1" ]; then
        echo ""
        echo "Setting up local Android builds..."
        echo ""
        echo "Note: You need Android Studio installed and configured"
        echo "Press Ctrl+C to cancel, or Enter to continue"
        read

        echo ""
        echo "Adding Android platform to Child app..."
        npx cap add android --config capacitor.config.child.ts
        mv android android-child

        echo "Adding Android platform to Parent app..."
        npx cap add android --config capacitor.config.parent.ts
        mv android android-parent

        echo "Adding Android platform to School app..."
        npx cap add android --config capacitor.config.school.ts
        mv android android-school

        echo ""
        echo "✓ Android platforms added"
        echo ""
        echo "========================================"
        echo "Next Steps:"
        echo "========================================"
        echo ""
        echo "To build APKs, run these commands:"
        echo ""
        echo "1. Child App:"
        echo "   cd android-child"
        echo "   ./gradlew assembleDebug"
        echo "   # APK: android-child/app/build/outputs/apk/debug/app-debug.apk"
        echo ""
        echo "2. Parent App:"
        echo "   cd android-parent"
        echo "   ./gradlew assembleDebug"
        echo "   # APK: android-parent/app/build/outputs/apk/debug/app-debug.apk"
        echo ""
        echo "3. School App:"
        echo "   cd android-school"
        echo "   ./gradlew assembleDebug"
        echo "   # APK: android-school/app/build/outputs/apk/debug/app-debug.apk"
        echo ""
        echo "OR open each in Android Studio:"
        echo "  npx cap open android --config capacitor.config.child.ts"
        echo ""

    elif [ "$choice" = "2" ]; then
        echo ""
        echo "Setting up cloud build with EAS..."
        echo ""

        # Check if EAS CLI is installed
        if ! command -v eas &> /dev/null; then
            echo "Installing EAS CLI..."
            npm install -g eas-cli
        fi

        echo "✓ EAS CLI ready"
        echo ""
        echo "========================================"
        echo "Next Steps:"
        echo "========================================"
        echo ""
        echo "1. Login to Expo:"
        echo "   eas login"
        echo ""
        echo "2. Build Child APK:"
        echo "   eas build --platform android --profile development"
        echo ""
        echo "3. Repeat for Parent and School apps"
        echo ""
        echo "See BUILD_ANDROID_APKS.md for detailed instructions"
        echo ""
    else
        echo "Invalid choice. Please run the script again."
        exit 1
    fi
else
    echo "Android platforms already set up"
    echo ""
    echo "To rebuild web code and sync:"
    echo "  npm run cap:sync:child"
    echo "  npm run cap:sync:parent"
    echo "  npm run cap:sync:school"
fi

echo ""
echo "========================================"
echo "Build Complete!"
echo "========================================"
echo ""
echo "See BUILD_ANDROID_APKS.md for detailed build instructions"
echo ""
