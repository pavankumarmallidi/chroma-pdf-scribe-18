// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jxcvonbmosywkqtomrbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y3ZvbmJtb3N5d2txdG9tcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjc2NTYsImV4cCI6MjA2NDAwMzY1Nn0.L3oc3QtOnBBqxVIhiLimQub3LBG_GJWmw_SV-fkXGfU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);