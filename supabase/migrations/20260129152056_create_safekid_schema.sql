/*
  # SafeKid Database Schema
  
  ## Overview
  Complete database schema for the SafeKid child safety and emergency communication system.
  
  ## Tables Created
  
  ### 1. `profiles`
  Extended user profile information linked to Supabase auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - Either 'parent' or 'child'
  - `phone` (text, optional) - Contact phone number
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `family_links`
  Connects parents with their children in the system
  - `id` (uuid, primary key) - Unique link identifier
  - `parent_id` (uuid) - References profiles(id) for parent
  - `child_id` (uuid) - References profiles(id) for child
  - `status` (text) - Link status: 'pending', 'active', 'revoked'
  - `created_at` (timestamptz) - Link creation timestamp
  
  ### 3. `emergency_events`
  Stores all SOS emergency events triggered by children
  - `id` (uuid, primary key) - Unique event identifier
  - `child_id` (uuid) - References profiles(id) for child who triggered SOS
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `location_accuracy` (numeric, optional) - GPS accuracy in meters
  - `silent_mode` (boolean) - Whether silent mode was enabled
  - `status` (text) - Event status: 'active', 'acknowledged', 'resolved'
  - `acknowledged_by` (uuid, optional) - Parent who acknowledged the event
  - `acknowledged_at` (timestamptz, optional) - Acknowledgment timestamp
  - `resolved_at` (timestamptz, optional) - Resolution timestamp
  - `notes` (text, optional) - Additional notes from parent
  - `created_at` (timestamptz) - Event creation timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:
  
  #### Profiles
  - Users can view their own profile
  - Users can update their own profile
  - Users can insert their own profile during registration
  
  #### Family Links
  - Parents and children can view their own family links
  - Only parents can create new family links
  - Only parents can update family link status
  
  #### Emergency Events
  - Children can create emergency events
  - Children can view their own emergency events
  - Parents can view emergency events from their linked children
  - Parents can update emergency events from their linked children
  
  ## Indexes
  - Foreign key indexes for optimal query performance
  - Status indexes for filtering active events
  - Timestamp indexes for chronological queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('parent', 'child')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create family_links table
CREATE TABLE IF NOT EXISTS family_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'revoked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Create emergency_events table
CREATE TABLE IF NOT EXISTS emergency_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_accuracy numeric,
  silent_mode boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  acknowledged_by uuid REFERENCES profiles(id),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_family_links_parent ON family_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_family_links_child ON family_links(child_id);
CREATE INDEX IF NOT EXISTS idx_family_links_status ON family_links(status);
CREATE INDEX IF NOT EXISTS idx_emergency_events_child ON emergency_events(child_id);
CREATE INDEX IF NOT EXISTS idx_emergency_events_status ON emergency_events(status);
CREATE INDEX IF NOT EXISTS idx_emergency_events_created ON emergency_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Family links policies
CREATE POLICY "Users can view own family links"
  ON family_links FOR SELECT
  TO authenticated
  USING (
    auth.uid() = parent_id OR auth.uid() = child_id
  );

CREATE POLICY "Parents can create family links"
  ON family_links FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = parent_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'parent'
    )
  );

CREATE POLICY "Parents can update family links"
  ON family_links FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = parent_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'parent'
    )
  )
  WITH CHECK (
    auth.uid() = parent_id
  );

-- Emergency events policies
CREATE POLICY "Children can create emergency events"
  ON emergency_events FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = child_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'child'
    )
  );

CREATE POLICY "Children can view own emergency events"
  ON emergency_events FOR SELECT
  TO authenticated
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can view linked children emergency events"
  ON emergency_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_links
      WHERE family_links.parent_id = auth.uid()
        AND family_links.child_id = emergency_events.child_id
        AND family_links.status = 'active'
    )
  );

CREATE POLICY "Parents can update linked children emergency events"
  ON emergency_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_links
      WHERE family_links.parent_id = auth.uid()
        AND family_links.child_id = emergency_events.child_id
        AND family_links.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_links
      WHERE family_links.parent_id = auth.uid()
        AND family_links.child_id = emergency_events.child_id
        AND family_links.status = 'active'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();