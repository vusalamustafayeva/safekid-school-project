import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'parent' | 'child';
  phone?: string;
  created_at: string;
  updated_at: string;
};

export type FamilyLink = {
  id: string;
  parent_id: string;
  child_id: string;
  status: 'pending' | 'active' | 'revoked';
  created_at: string;
};

export type EmergencyEvent = {
  id: string;
  child_id: string;
  latitude: number;
  longitude: number;
  location_accuracy?: number;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  notes?: string;
  created_at: string;
};

export type LocationUpdate = {
  id: string;
  child_id: string;
  latitude: number;
  longitude: number;
  location_accuracy?: number;
  battery_level?: number;
  created_at: string;
};
