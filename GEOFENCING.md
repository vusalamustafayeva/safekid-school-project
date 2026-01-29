# SafeKid School Geofencing Logic

## Overview

**Dieses Projekt wurde speziell für die BBS Cora Berliner konzipiert.**

SafeKid implements intelligent geofencing specifically for BBS Cora Berliner to protect student privacy while ensuring the school can respond to emergencies in their immediate vicinity.

## How It Works

### 1. SOS Alert Triggered

When a child presses the SOS button:
- The app captures the child's GPS location
- The location is sent to the SafeKid system
- The system calculates the distance to all registered schools

### 2. Notification Logic

**Parents:**
- Always receive notifications for their children
- Regardless of location
- Immediate notification with live GPS location

**Schools:**
- Only receive notifications if the child is within the school's geofence radius
- Default radius: 1000 meters (1 km)
- Outside this radius, schools receive NO notification
- This protects family privacy for incidents away from school

### 3. Role-Based Dashboard

The School Dashboard uses the same interface as the Parent Dashboard with one key difference:
- **Parents:** See all alerts for their children
- **Schools:** Only see alerts within their geofence radius
- No separate UI components needed
- All filtering happens in the data layer

## BBS Cora Berliner - Project School

This SafeKid implementation is specifically designed and configured for BBS Cora Berliner.

**School Details:**
- Name: BBS Cora Berliner
- Address: Nußriede 4, 30627 Hannover, Germany
- Coordinates: 52.38875° N, 9.81001° E
- Geofence Radius: 1000 meters (1 km)

**Geofence Coverage Area:**
- BBS Cora Berliner receives notifications for any student within 1 km of Nußriede 4, Hannover
- This covers the immediate school surroundings and nearby areas
- Students outside this area remain private between family members
- The geofence is specifically calibrated for the school's location and surrounding environment

## Distance Calculation

The system uses the Haversine formula to calculate the great-circle distance between two points on Earth:

```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

This provides accurate distance measurements accounting for Earth's curvature.

## Privacy Protection

**Key Privacy Features:**
1. Schools only see emergencies in their immediate vicinity
2. Family privacy is protected for incidents away from school
3. No location tracking - only point-in-time emergency locations
4. No historical location data stored beyond the emergency event

**Example Scenarios:**

✅ **Child sends SOS 500m from BBS Cora Berliner:**
- Parents: Notified immediately
- School: Notified immediately
- Reason: Within 1 km geofence

❌ **Child sends SOS 2 km from BBS Cora Berliner:**
- Parents: Notified immediately
- School: NOT notified
- Reason: Outside 1 km geofence - family privacy protected

✅ **Child sends SOS at home on weekend:**
- Parents: Notified immediately
- School: NOT notified (unless home happens to be within 1 km of school)
- Reason: School is only responsible for incidents in their area

## Implementation Details

**Database Tables:**
- `schools`: Stores school information and geofence radius
- `sos_events`: Stores emergency events with GPS coordinates
- No pre-association needed between children and schools

**Real-time Monitoring:**
- School dashboard monitors ALL SOS events in real-time
- Filters events on the client side based on geofence
- Uses Supabase real-time subscriptions for instant notifications

**Technical Stack:**
- Frontend: React + TypeScript
- Database: Supabase (PostgreSQL)
- Real-time: Supabase Realtime
- Maps: Leaflet + OpenStreetMap
- Geocoding: Nominatim (OpenStreetMap)

## Testing the Geofence

To test the geofencing logic:

1. Open the Child App and send an SOS
2. Use coordinates within 1 km of BBS Cora Berliner (52.38875, 9.81001)
3. Check that both Parent and School dashboards receive the alert
4. Try coordinates outside the 1 km radius
5. Verify that only the Parent dashboard receives the alert

## Coordinates for Testing

**Within Geofence (will notify school):**
- 52.389, 9.810 (~100m from school)
- 52.395, 9.815 (~750m from school)
- 52.380, 9.820 (~950m from school)

**Outside Geofence (will NOT notify school):**
- 52.400, 9.830 (~2.5 km from school)
- 52.370, 9.800 (~2 km from school)
- 52.520, 13.405 (Berlin - far away)

## Future Enhancements

Potential improvements to the geofencing system:
- Multiple schools per child
- Adjustable geofence radius per school
- Time-based geofencing (only during school hours)
- Automated school association based on enrollment data
- Push notifications to school staff mobile devices
