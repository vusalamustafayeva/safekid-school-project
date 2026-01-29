/*
  # Create Location Updates Table
  
  ## Overview
  This migration creates a table for passive location tracking, separate from emergency events.
  Parents can see their child's location at all times, not just during emergencies.
  
  ## Tables Created
  
  ### `location_updates`
  Stores continuous location updates from children's devices
  - `id` (uuid, primary key) - Unique update identifier
  - `child_id` (uuid) - References profiles(id) for the child
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `location_accuracy` (numeric, optional) - GPS accuracy in meters
  - `battery_level` (integer, optional) - Device battery percentage (0-100)
  - `created_at` (timestamptz) - Location update timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  - Children can insert their own location updates
  - Children can view their own location updates
  - Parents can view location updates from their linked children
  
  ## Indexes
  - Child ID index for fast lookups
  - Timestamp index for getting latest location
*/

-- Create location_updates table
CREATE TABLE IF NOT EXISTS location_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_accuracy numeric,
  battery_level integer CHECK (battery_level >= 0 AND battery_level <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_location_updates_child ON location_updates(child_id);
CREATE INDEX IF NOT EXISTS idx_location_updates_created ON location_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_updates_child_created ON location_updates(child_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;

-- Location updates policies
CREATE POLICY "Children can insert own location updates"
  ON location_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = child_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'child'
    )
  );

CREATE POLICY "Children can view own location updates"
  ON location_updates FOR SELECT
  TO authenticated
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can view linked children location updates"
  ON location_updates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_links
      WHERE family_links.parent_id = auth.uid()
        AND family_links.child_id = location_updates.child_id
        AND family_links.status = 'active'
    )
  );
