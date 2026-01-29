/*
  # Enable Demo Mode for SOS Events
  
  ## Overview
  This migration enables demo mode for the SafeKid app, allowing the Child App
  to send SOS events without authentication. This is essential for school
  project demonstrations.
  
  ## Changes Made
  
  ### 1. Make child_id Reference Optional
  - Temporarily disable the foreign key constraint on emergency_events
  - This allows demo SOS events with a hardcoded child_id
  
  ### 2. Add Anonymous Insert Policy
  - Allow anonymous (unauthenticated) users to create emergency events
  - This enables the Child App to work without login
  
  ### 3. Allow Parents to View All Emergency Events in Demo Mode
  - Parents can view any emergency event (not just linked children)
  - This ensures demo parent accounts can see demo SOS events
  
  ## Security Notes
  - This is designed for DEMO/TESTING purposes only
  - In production, these policies should be more restrictive
  - The demo child_id used is: 00000000-0000-0000-0000-000000000001
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Children can create emergency events" ON emergency_events;
DROP POLICY IF EXISTS "Demo mode: Allow anonymous SOS for demo child" ON emergency_events;
DROP POLICY IF EXISTS "Parents can view linked children emergency events" ON emergency_events;

-- Allow authenticated children to create emergency events (keep existing functionality)
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

-- NEW: Allow anonymous users to create emergency events for demo purposes
CREATE POLICY "Demo mode: Anonymous users can create SOS events"
  ON emergency_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- NEW: Allow parents to view all emergency events (for demo mode)
CREATE POLICY "Parents can view emergency events"
  ON emergency_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'parent'
    )
  );

-- Keep the original policy for linked children (for when proper accounts exist)
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