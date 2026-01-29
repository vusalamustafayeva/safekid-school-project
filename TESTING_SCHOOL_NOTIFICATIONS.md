# Testing School Notification System

## Overview

This document explains how to test the geofencing and school notification logic for SafeKid.

## Recent Fixes (2026-01-29)

### Fix #1: School Notifications Not Arriving
**Issue:** School notifications were not arriving because of a React closure bug in the realtime subscription.

**Root Cause:** The subscription was set up with an empty dependency array, capturing stale references to `loadData()` and `school` state. When SOS events arrived, the callback tried to filter them but had no access to the current school data.

**Solution:**
1. Restructured useEffect hooks to set up subscription AFTER school data loads
2. Wrapped `loadData` in `useCallback` with proper dependencies
3. Made subscription dependent on `school` state to ensure fresh closures

**Result:** School App now correctly receives and filters SOS events based on 1 km geofence in real-time.

### Fix #2: Role-Based Alarm Control
**Issue:** When one user (parent OR school) pressed "Bestätigen", the alarm stopped for ALL parties.

**Root Cause:** The "Bestätigen" button updated the SOS event status to "acknowledged" in the database, affecting all subscribed clients globally.

**Solution:**
1. Made acknowledgment LOCAL per client using component state (`locallyAcknowledged`)
2. Removed database update from `handleAcknowledge` - now only stops local alarm
3. Alarm trigger now filters out locally acknowledged events
4. UI shows different styling for locally acknowledged events ("Bestätigter Notfall (Eltern)" or "Bestätigter Notfall (Schule)")
5. "Auflösen" button still updates database globally (correct behavior)

**Result:**
- Parent presses "Bestätigen" → Parent alarm stops, School alarm continues
- School presses "Bestätigen" → School alarm stops, Parent alarm continues
- Each role controls their own alarm independently
- SOS event remains "active" in database until someone presses "Auflösen"

## School Configuration

**BBS Cora Berliner**
- Address: Nußriede 4, 30627 Hannover, Germany
- Coordinates: 52.38875°N, 9.81001°E
- Geofence radius: 1000 meters (1 km)

## Notification Logic

### Parent Notifications
- **Always receive ALL SOS events** from their children
- No geofencing restrictions
- Filter: `child_id = demo-child`

### School Notifications (BBS Cora Berliner)
- **Only receive SOS events within 1 km** of the school
- Geofencing enforced
- Filter: ALL events, then distance calculation
- Privacy: Events outside geofence are never shown to school

## Button Behavior

### "Bestätigen" (Acknowledge) Button
- **Behavior:** LOCAL alarm control only
- **Does:** Stops alarm for that specific role/client
- **Does NOT:** Update database or affect other users
- **Effect:**
  - Parent presses → Parent alarm stops (school alarm continues)
  - School presses → School alarm stops (parent alarm continues)
- **UI Changes:**
  - Card changes from red to yellow
  - Title changes to "Bestätigter Notfall (Eltern)" or "Bestätigter Notfall (Schule)"
  - Button changes to "Auflösen"

### "Auflösen" (Resolve) Button
- **Behavior:** GLOBAL resolution
- **Does:** Updates database status to "resolved"
- **Effect:**
  - Event disappears for ALL users (parent and school)
  - Clears the emergency from the system
  - This is the final action to close the incident

## Testing Procedure

### Test 1: SOS Within Geofence (School SHOULD be notified)

1. Open **Child App** in browser
2. Allow location access when prompted
3. If testing in Hannover area (within 1 km of BBS Cora Berliner):
   - Press and hold the red SOS button for 3 seconds
   - Release when counter reaches 0

**Expected Results:**
- ✅ Parent App: Shows the emergency alert
- ✅ School App: Shows the emergency alert with distance
- ✅ School App: Alarm sound plays
- Console logs will show:
  ```
  📱 Parent App: WILL receive notification (always notified)
  🏫 SCHOOL ALERT TRIGGERED: Event [id] is within geofence - School will be notified!
  🚨 SCHOOL NOTIFICATION: BBS Cora Berliner has 1 active emergency event(s) to display!
  🚨 School alarm started
  ```

### Test 2: SOS Outside Geofence (School should NOT be notified)

1. Open **Child App** in browser
2. If you're NOT in Hannover (e.g., testing from Berlin, Munich, etc.):
   - Press and hold the red SOS button for 3 seconds
   - Release when counter reaches 0

**Expected Results:**
- ✅ Parent App: Shows the emergency alert
- ❌ School App: Does NOT show the alert (remains on "Warte auf Notfall-Signal")
- ❌ School App: NO alarm sound
- Console logs will show:
  ```
  📱 Parent App: WILL receive notification (always notified)
  🔒 SCHOOL ALERT BLOCKED: Event [id] is outside geofence - Privacy protected.
  ✅ No events within BBS Cora Berliner geofence - Waiting for SOS signals...
  ```

### Test 3: Role-Based Alarm Control

This test verifies that acknowledgment is independent per role:

1. Send an SOS from within school geofence (so both Parent and School receive it)
2. **Both Parent App and School App should show alarm** with sound
3. In **Parent App**: Press "Bestätigen"
   - ✅ Parent alarm stops
   - ✅ Parent card changes to yellow with "Bestätigter Notfall (Eltern)"
4. Check **School App**:
   - ✅ School alarm STILL PLAYING
   - ✅ School card STILL RED
   - ✅ School still shows "Bestätigen" button
5. In **School App**: Press "Bestätigen"
   - ✅ School alarm stops
   - ✅ School card changes to yellow with "Bestätigter Notfall (Schule)"
6. Both apps now show "Auflösen" button
7. Press "Auflösen" in either app
   - ✅ Event disappears from BOTH apps

**Expected Console Logs:**
```
✓ Parent locally acknowledging SOS event (alarm stopped for parent only): [id]
🔇 Alarm stopped
✓ School locally acknowledging SOS event (alarm stopped for school only): [id]
🔇 School alarm stopped
```

### Test 4: Simulating Different Locations

If you want to test different locations without physically being there, you can use browser developer tools:

1. Open Chrome DevTools (F12)
2. Click the three dots menu → More tools → Sensors
3. Under "Location", select a preset or enter custom coordinates:
   - **Within geofence**: 52.38875, 9.81001 (exact school location)
   - **Within geofence**: 52.39500, 9.81500 (nearby, ~800m away)
   - **Outside geofence**: 52.40000, 9.85000 (outside, ~3km away)
   - **Outside geofence**: 52.5200, 13.4050 (Berlin, ~250km away)
4. Refresh the Child App page
5. Press the SOS button

## Console Logging

All apps log extensively to help with testing and debugging:

### Child App Logs
```
🚨 DEMO MODE: Sending SOS event as demo-child
📍 Location obtained: {latitude, longitude, accuracy}
✅ SOS EVENT CREATED
🔔 NOTIFICATION LOGIC:
  📱 Parent App: WILL receive notification (always notified)
  🏫 School App: Checking geofence for location...
  📏 School will be notified ONLY if child is within 1 km...
```

### Parent App Logs
```
👨‍👩‍👧‍👦 Parent App: Starting demo mode - monitoring demo-child
📡 SOS subscription status: SUBSCRIBED
🔔 Real-time SOS event received: [payload]
📊 Loading SOS events for demo-child...
✅ Loaded SOS events: [data]
🚨 Alarm started
```

### School App Logs
```
🏫 School App: Loading BBS Cora Berliner and monitoring geofenced SOS events
🏫 Loading school data for: BBS Cora Berliner
✅ Loaded school data: [school]
📡 School SOS subscription status: SUBSCRIBED
🔔 Real-time SOS event received in school app: [payload]
📊 Loading ALL SOS events and filtering by school geofence...
📏 Event [id]: XXXm from BBS Cora Berliner (WITHIN/OUTSIDE 1000m geofence)
🏫 SCHOOL ALERT TRIGGERED: Event [id] is within geofence - School will be notified!
    OR
🔒 SCHOOL ALERT BLOCKED: Event [id] is outside geofence - Privacy protected.
✅ Filtered to X events within BBS Cora Berliner geofence
🚨 School alarm started
```

## Distance Calculation

The system uses the **Haversine formula** to calculate accurate distances on Earth's curved surface:

```
Distance = 2 × R × arcsin(√(sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)))

Where:
- R = Earth's radius (6371 km)
- φ = latitude in radians
- λ = longitude in radians
- Δφ = difference in latitudes
- Δλ = difference in longitudes
```

This accounts for Earth's curvature and provides meter-accurate results.

## Troubleshooting

### School App Shows No Events (But Should)

1. Check browser console for logs
2. Verify the school loaded correctly:
   - Look for: `✅ Loaded school data: {name: "BBS Cora Berliner", ...}`
3. Check if events are being filtered out:
   - Look for distance logs: `📏 Event [id]: XXXm from BBS Cora Berliner (OUTSIDE 1000m geofence)`
4. Verify your test location is actually within 1 km

### Parent App Shows No Events

1. Check if SOS was created successfully:
   - Look for: `✅ SOS EVENT CREATED`
2. Check subscription status:
   - Look for: `📡 SOS subscription status: SUBSCRIBED`
3. Try refreshing the Parent App page

### Location Access Denied

1. Check browser location permissions
2. For Chrome: Click the lock icon in address bar → Site settings → Location → Allow
3. Refresh the page and try again

## Privacy Verification

To verify privacy protection is working:

1. Send an SOS from a location far from Hannover (e.g., Berlin)
2. Open School App
3. Verify:
   - ❌ No emergency card is displayed
   - ❌ No alarm sound plays
   - ✅ Console shows: `🔒 SCHOOL ALERT BLOCKED`
   - ✅ UI shows: "Warte auf Notfall-Signal"

This confirms that schools cannot see events outside their geofence, protecting student privacy for incidents away from school.

## Real-Time Updates

Both Parent App and School App use **Supabase Realtime subscriptions**:

- Events are pushed immediately when created
- No polling or manual refresh needed
- Typical latency: < 1 second
- Connection status logged in console

## Success Criteria

✅ **Working correctly if:**
- Parent App always receives SOS notifications
- School App receives SOS only when child is within 1 km
- School App shows distance from school for each event
- Alarm plays in School App for geofenced events
- Clear console logs confirm filtering logic
- Privacy is protected for events outside geofence

❌ **Issues if:**
- School App shows events from outside geofence
- School App shows no events when SOS is sent nearby
- Parent App doesn't receive notifications
- No alarm sound when events should trigger it
