import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

console.log("supabaseUrl: ", process.env.REACT_APP_SUPABASE_URL);
console.log("supabaseUrl: ", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
