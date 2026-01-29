/*
  # Enable Realtime for Emergency Tables
  
  ## Changes
  This migration enables Supabase realtime functionality for critical tables
  to ensure instant notifications when emergency events occur.
  
  ## Tables Updated
  - `emergency_events` - Enable realtime for instant parent notifications
  - `location_updates` - Enable realtime for live location tracking
  
  ## Why This Matters
  Without realtime enabled, parents won't receive instant notifications when
  children trigger SOS events. This is critical safety functionality.
*/

-- Enable realtime for emergency_events table
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_events;

-- Enable realtime for location_updates table  
ALTER PUBLICATION supabase_realtime ADD TABLE location_updates;