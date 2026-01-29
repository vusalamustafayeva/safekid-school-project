# Quick Start: Build SafeKid APKs

## TL;DR - Fastest Way to Get APKs

You have **TWO options**. Choose one:

### Option A: Use Online Build Service (EASIEST)

No Android Studio needed! Builds APKs in the cloud.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the web apps:**
   ```bash
   npm run build:child
   npm run build:parent
   npm run build:school
   ```

3. **Use an online APK builder:**
   - Upload each `dist-*` folder to https://www.pwabuilder.com
   - Click "Build Android App"
   - Download the APK
   - Repeat for all three folders

**Time:** 15-20 minutes total

---

### Option B: Local Build with Android Studio

Full control, but requires setup.

1. **Install requirements:**
   - Android Studio: https://developer.android.com/studio
   - Node.js 18+: https://nodejs.org

2. **Run the automated setup:**
   ```bash
   chmod +x build-apks.sh
   ./build-apks.sh
   ```

3. **Follow the prompts** - the script guides you through everything

4. **Build APKs in Android Studio:**
   - Open each android folder
   - Click Build → Build APK
   - Find APK in `app/build/outputs/apk/debug/`

**Time:** 1-2 hours (includes Android Studio setup)

---

## What You'll Get

Three independent Android apps:

- **SafeKid-Child.apk** (296 KB)
  - Child interface only
  - SOS button
  - Signal button

- **SafeKid-Parent.apk** (451 KB)
  - Parent dashboard
  - Live location map
  - Emergency alerts with alarm

- **SafeKid-School.apk** (454 KB)
  - School dashboard
  - 1km geofencing
  - Emergency alerts with alarm

All three can be installed on the same device simultaneously.

---

## Testing the APKs

1. **Transfer to Android device** via USB or cloud storage
2. **Enable "Install from Unknown Sources"** in device settings
3. **Tap APK file** to install
4. **Grant location permissions** when prompted
5. **Test the SOS system:**
   - Open Child app → Press SOS
   - Check Parent app → Should show alert
   - Check School app → Should show alert if within 1km of school

---

## Troubleshooting

**Q: I don't have Android Studio and don't want to install it**
→ Use Option A (online build service)

**Q: The APK won't install on my phone**
→ Enable "Install from Unknown Sources" in Settings → Security

**Q: The app crashes when I open it**
→ Make sure `.env` file exists with Supabase credentials before building

**Q: Location isn't working**
→ Grant location permissions: Settings → Apps → SafeKid → Permissions

**Q: I need help with detailed steps**
→ See BUILD_ANDROID_APKS.md for comprehensive guide

---

## For Your School Presentation

**Recommended setup:**

1. Install all three APKs on a single Android device
2. Have the device ready to demonstrate
3. Test the SOS flow beforehand:
   - Child app sends SOS
   - Parent app receives alert
   - School app receives alert (if within geofence)

**Demo tips:**
- Show all three apps side by side
- Demonstrate the alarm sound
- Explain the geofencing feature
- Show the live location map

---

## Support

Need more details? Check these files:
- `BUILD_ANDROID_APKS.md` - Complete build instructions
- `TESTING_SCHOOL_NOTIFICATIONS.md` - Testing procedures
- `GEOFENCING.md` - Geofencing details

Good luck with your presentation! 🎓
