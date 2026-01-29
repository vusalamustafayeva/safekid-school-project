/*
  # Create SOS Events Table for Demo Mode
  
  ## Overview
  This migration creates a dedicated `sos_events` table for the school project demo.
  It enables the Child App to send SOS events without authentication by using
  a fixed demo child identity.
  
  ## New Tables
  
  ### `sos_events`
  - `id` (uuid, primary key) - Unique event identifier
  - `child_id` (text) - Fixed demo child ID: "demo-child"
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `location_accuracy` (numeric, optional) - GPS accuracy in meters
  - `status` (text) - Event status: 'active', 'acknowledged', 'resolved'
  - `acknowledged_at` (timestamptz, optional) - When parent acknowledged
  - `resolved_at` (timestamptz, optional) - When event was resolved
  - `created_at` (timestamptz) - Event creation timestamp
  
  ## Security - Demo Mode RLS Policies
  
  ### For Anonymous Users (Child App)
  - **INSERT Policy**: Allow anonymous users to create SOS events
    - ONLY when child_id = 'demo-child'
    - This enables the demo without authentication
  
  ### For All Users (Parent App)
  - **SELECT Policy**: Allow anyone to read SOS events
    - Enables Parent App to monitor demo-child events
    - No authentication required for demo purposes
  
  ### For Authenticated Users (Parent App)
  - **UPDATE Policy**: Allow any authenticated user to update SOS status
    - Enables acknowledgment and resolution actions
    - Works with any parent account in demo mode
  
  ## Realtime
  - Realtime replication enabled for instant Parent App notifications
  
  ## Important Notes
  - This is designed for DEMONSTRATION purposes only
  - Production apps should have stricter security
  - The demo child ID is: "demo-child"
  - No real authentication required for basic SOS flow
*/

-- Create sos_events table
CREATE TABLE IF NOT EXISTS sos_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id text NOT NULL DEFAULT 'demo-child',
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_accuracy numeric,
  status text NOT NULL DEFAULT 'active',
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for status values
ALTER TABLE sos_events DROP CONSTRAINT IF EXISTS sos_events_status_check;
ALTER TABLE sos_events ADD CONSTRAINT sos_events_status_check 
  CHECK (status IN ('active', 'acknowledged', 'resolved'));

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_sos_events_child_status 
  ON sos_events(child_id, status);

CREATE INDEX IF NOT EXISTS idx_sos_events_created_at 
  ON sos_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Demo: Anonymous users can create SOS for demo-child" ON sos_events;
DROP POLICY IF EXISTS "Demo: Anyone can read SOS events" ON sos_events;
DROP POLICY IF EXISTS "Demo: Authenticated users can update SOS status" ON sos_events;

-- Policy 1: Allow anonymous inserts ONLY for demo-child
CREATE POLICY "Demo: Anonymous users can create SOS for demo-child"
  ON sos_events FOR INSERT
  TO anon
  WITH CHECK (child_id = 'demo-child');

-- Policy 2: Allow anyone to read SOS events (for demo monitoring)
CREATE POLICY "Demo: Anyone can read SOS events"
  ON sos_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 3: Allow authenticated users to update SOS events
CREATE POLICY "Demo: Authenticated users can update SOS status"
  ON sos_events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enable realtime for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE sos_events;