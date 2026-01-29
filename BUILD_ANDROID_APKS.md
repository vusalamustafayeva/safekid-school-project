# Building SafeKid Android APKs

This guide explains how to build three separate Android APKs for the SafeKid app:
- **SafeKid-Child.apk** - Child interface with SOS button
- **SafeKid-Parent.apk** - Parent dashboard with live location and alerts
- **SafeKid-School.apk** - School dashboard with geofencing and alerts

## Prerequisites

You have TWO options for building APKs:

### Option 1: Local Build (Requires Android Studio)
- Node.js 18+ installed
- Android Studio installed
- Android SDK configured (API 33+)
- Java Development Kit 17+ installed

### Option 2: Cloud Build (Easiest - No Local Setup)
- Node.js 18+ installed
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (free tier works)

## Project Setup (Already Completed)

The project has been configured with:
- ✅ Three separate entry points (main.child.tsx, main.parent.tsx, main.school.tsx)
- ✅ Three separate HTML files (index.child.html, index.parent.html, index.school.html)
- ✅ Three Vite build configurations
- ✅ Three Capacitor configurations
- ✅ Build scripts in package.json

## Build Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build All Three Web Apps

```bash
npm run build:child
npm run build:parent
npm run build:school
```

This creates three separate build directories:
- `dist-child/` - Child app build
- `dist-parent/` - Parent app build
- `dist-school/` - School app build

---

## Option 1: Local Build with Android Studio

### Step 3a: Add Android Platform to Each App

Run these commands one at a time:

```bash
# Child App
npx cap add android --config capacitor.config.child.ts

# Parent App
npx cap add android --config capacitor.config.parent.ts

# School App
npx cap add android --config capacitor.config.school.ts
```

This creates three separate Android projects in `android/` directories.

### Step 4a: Sync Web Code with Android Projects

```bash
npm run cap:sync:child
npm run cap:sync:parent
npm run cap:sync:school
```

### Step 5a: Open in Android Studio and Build APKs

**For Child App:**
```bash
npx cap open android --config capacitor.config.child.ts
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Rename to `SafeKid-Child.apk`

**For Parent App:**
```bash
npx cap open android --config capacitor.config.parent.ts
```

Repeat the same Android Studio build steps.
- Rename output to `SafeKid-Parent.apk`

**For School App:**
```bash
npx cap open android --config capacitor.config.school.ts
```

Repeat the same Android Studio build steps.
- Rename output to `SafeKid-School.apk`

---

## Option 2: Cloud Build with EAS (Recommended)

This option builds APKs in the cloud without requiring Android Studio or SDK.

### Step 3b: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 4b: Login to Expo

```bash
eas login
```

Create a free account at https://expo.dev if you don't have one.

### Step 5b: Configure EAS for Each App

Create `eas.json` in project root:

```json
{
  "build": {
    "child": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "parent": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "school": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### Step 6b: Build APKs in the Cloud

```bash
# Build Child App
eas build --platform android --profile child --config capacitor.config.child.ts

# Build Parent App
eas build --platform android --profile parent --config capacitor.config.parent.ts

# Build School App
eas build --platform android --profile school --config capacitor.config.school.ts
```

Each build takes 5-10 minutes. When complete, download the APKs from the EAS dashboard.

---

## Testing the APKs

### Install on Android Device

1. Enable **Developer Options** on your Android device
2. Enable **Install from Unknown Sources**
3. Transfer APK to device via USB or cloud storage
4. Tap APK file to install
5. Open the installed app

### Expected Behavior

**SafeKid Child App:**
- Opens directly to child interface
- Shows SOS button and signal button
- No navigation to other pages

**SafeKid Parent App:**
- Opens directly to parent dashboard
- Shows demo child location
- Displays emergency alerts
- Plays alarm sound for SOS events

**SafeKid School App:**
- Opens directly to school dashboard
- Shows BBS Cora Berliner school info
- Filters SOS events by 1 km geofence
- Plays alarm sound for geofenced events

### Important Notes

1. **All three apps can be installed simultaneously** on the same device - they have different app IDs:
   - `com.safekid.child`
   - `com.safekid.parent`
   - `com.safekid.school`

2. **Demo Mode:** All apps currently run in demo mode with:
   - Child: `demo-child` user
   - Parent: Monitors `demo-child`
   - School: Monitors BBS Cora Berliner geofence

3. **Environment Variables:** Make sure `.env` file is present with Supabase credentials before building.

4. **Location Permissions:** The apps will request location permissions on first launch. Grant them for full functionality.

## Troubleshooting

### Build Fails with "Android SDK not found"

**Solution:** Install Android Studio and configure Android SDK, or use Option 2 (Cloud Build).

### APK Installs but Crashes on Launch

**Solution:** Check that `.env` file exists with valid Supabase credentials before building.

### Location Not Working

**Solution:** Grant location permissions in Android Settings → Apps → [App Name] → Permissions.

### Alarm Sound Not Playing

**Solution:** Check device volume settings and notification permissions.

## File Structure

```
project/
├── capacitor.config.child.ts      # Child app Capacitor config
├── capacitor.config.parent.ts     # Parent app Capacitor config
├── capacitor.config.school.ts     # School app Capacitor config
├── vite.config.child.ts           # Child app Vite config
├── vite.config.parent.ts          # Parent app Vite config
├── vite.config.school.ts          # School app Vite config
├── index.child.html               # Child app HTML entry
├── index.parent.html              # Parent app HTML entry
├── index.school.html              # School app HTML entry
├── src/
│   ├── main.child.tsx             # Child app entry point
│   ├── main.parent.tsx            # Parent app entry point
│   ├── main.school.tsx            # School app entry point
│   └── pages/
│       ├── ChildApp.tsx           # Child interface
│       ├── ParentApp.tsx          # Parent dashboard
│       └── SchoolApp.tsx          # School dashboard
└── package.json                   # Build scripts
```

## Production Signing (Optional)

For production APKs that can be published to Google Play:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore safekid.keystore -alias safekid -keyalg RSA -keysize 2048 -validity 10000
```

2. Update each `capacitor.config.*.ts`:
```typescript
android: {
  buildOptions: {
    keystorePath: './safekid.keystore',
    keystorePassword: 'your-password',
    keystoreAlias: 'safekid',
    keystoreAliasPassword: 'your-alias-password',
    releaseType: 'APK'
  }
}
```

3. Rebuild APKs with production signing

## Support

For issues or questions:
- Check TESTING_SCHOOL_NOTIFICATIONS.md for testing procedures
- Check GEOFENCING.md for geofencing details
- Review console logs in Chrome DevTools when testing web builds first

## Build Scripts Reference

```bash
# Build individual web apps
npm run build:child
npm run build:parent
npm run build:school

# Sync with Capacitor (after web build)
npm run cap:sync:child
npm run cap:sync:parent
npm run cap:sync:school

# Build all three web apps at once
npm run setup:all
```
