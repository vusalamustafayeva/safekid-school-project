/*
  # Allow Anonymous SOS Updates for Demo
  
  ## Overview
  This migration updates the RLS policy to allow anonymous users to
  acknowledge and resolve SOS events. This enables the Parent App demo
  to work completely without authentication.
  
  ## Changes
  - Drop existing UPDATE policy that requires authentication
  - Create new UPDATE policy that allows both anonymous and authenticated users
  - This enables full demo mode without any login requirements
  
  ## Security Notes
  - This is for DEMO purposes only
  - Production apps should require authentication for status updates
  - The policy still restricts updates to the sos_events table only
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Demo: Authenticated users can update SOS status" ON sos_events;

-- Create new policy that allows anonymous updates
CREATE POLICY "Demo: Anyone can update SOS status"
  ON sos_events FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);