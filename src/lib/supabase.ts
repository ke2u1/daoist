
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseAnonKey) {
    try {
        // Validate URL format before creating client
        new URL(supabaseUrl);
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error("Invalid Supabase URL provided. Please check your .env file. Auth features will be disabled.", e);
    }
} else {
    console.warn("Supabase URL or Anon Key is missing. Please check your .env file. Auth features will be disabled.");
}

// @ts-ignore
export { supabase };
