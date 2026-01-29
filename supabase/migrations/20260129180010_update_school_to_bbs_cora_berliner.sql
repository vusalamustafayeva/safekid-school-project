/*
  # Update School to BBS Cora Berliner

  1. Changes
    - Delete existing demo school
    - Insert BBS Cora Berliner with correct Hannover coordinates
    - Latitude: 52.38875° N
    - Longitude: 9.81001° E
    - Address: Nußriede 4, 30627 Hannover
    - Geofence radius: 1000 meters (1 km)

  2. Security
    - No RLS changes needed
    - Uses existing policies

  3. Notes
    - This ensures SchoolApp can find "BBS Cora Berliner"
    - Coordinates are accurate for the school location
    - Child association remains with demo-child
*/

-- Delete existing demo school
DELETE FROM schools WHERE name = 'Demo Grundschule Berlin';

-- Insert BBS Cora Berliner with correct coordinates
INSERT INTO schools (id, name, latitude, longitude, geofence_radius_meters)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'BBS Cora Berliner',
  52.38875,
  9.81001,
  1000
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  geofence_radius_meters = EXCLUDED.geofence_radius_meters;

-- Ensure demo-child is associated with BBS Cora Berliner
INSERT INTO child_schools (child_id, school_id)
VALUES (
  'demo-child',
  '00000000-0000-0000-0000-000000000001'::uuid
)
ON CONFLICT (child_id, school_id) DO NOTHING;