/*
  # Create Schools and Geofencing Support

  1. New Tables
    - `schools`
      - `id` (uuid, primary key) - Unique school identifier
      - `name` (text) - School name
      - `latitude` (double precision) - School latitude coordinate
      - `longitude` (double precision) - School longitude coordinate
      - `geofence_radius_meters` (integer) - Geofence radius in meters (default 1000m = 1km)
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `child_schools`
      - `child_id` (text) - Reference to child
      - `school_id` (uuid) - Reference to schools table
      - `created_at` (timestamptz) - Record creation timestamp
      - Primary key: (child_id, school_id)
  
  2. Demo Data
    - Insert demo school with location in Berlin
    - Associate demo-child with demo school
  
  3. Security
    - Enable RLS on all tables
    - Allow authenticated users to read schools
    - Allow authenticated users to read their associated schools
    - Public read access for demo purposes

  4. Notes
    - Geofencing logic will be handled in the application layer
    - Distance calculation uses Haversine formula
    - Default geofence radius is 1000 meters (1 km)
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  geofence_radius_meters integer DEFAULT 1000 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create child_schools junction table
CREATE TABLE IF NOT EXISTS child_schools (
  child_id text NOT NULL,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (child_id, school_id)
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_schools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools table
CREATE POLICY "Anyone can view schools in demo mode"
  ON schools
  FOR SELECT
  USING (true);

-- RLS Policies for child_schools table
CREATE POLICY "Anyone can view child-school associations in demo mode"
  ON child_schools
  FOR SELECT
  USING (true);

-- Insert demo school (Mitte, Berlin)
INSERT INTO schools (id, name, latitude, longitude, geofence_radius_meters)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Grundschule Berlin',
  52.5200,
  13.4050,
  1000
)
ON CONFLICT (id) DO NOTHING;

-- Associate demo-child with demo school
INSERT INTO child_schools (child_id, school_id)
VALUES (
  'demo-child',
  '00000000-0000-0000-0000-000000000001'::uuid
)
ON CONFLICT (child_id, school_id) DO NOTHING;