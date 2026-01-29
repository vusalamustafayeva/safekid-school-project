/*
  # Remove Silent Mode Feature
  
  ## Changes
  - Drop the `silent_mode` column from `emergency_events` table
  
  ## Details
  This migration removes the silent mode feature completely from the database.
  The silent_mode column is no longer needed as this feature has been removed
  from the application.
  
  ## Data Safety
  This uses IF EXISTS to prevent errors if the column has already been removed.
*/

-- Drop the silent_mode column from emergency_events table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emergency_events' AND column_name = 'silent_mode'
  ) THEN
    ALTER TABLE emergency_events DROP COLUMN silent_mode;
  END IF;
END $$;