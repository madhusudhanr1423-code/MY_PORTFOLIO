import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Project URL + publishable (anon) key. These are public-by-design values —
 * row level security is what protects the data. Env vars win when the Supabase
 * integration injects them; otherwise these literals are used.
 */
const FALLBACK_URL = "https://tckapqgrmffxquayquvg.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja2FwcWdybWZmeHF1YXlxdXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODQ4OTcsImV4cCI6MjEwMTI2MDg5N30.I5dp52_DFwRm581S4iuth2eUPFdWbe2qnW42ErwHTKc";

const url = (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ?? FALLBACK_URL;
const key =
  ((import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ??
    import.meta.env['VITE_SUPABASE_ANON_KEY']) as string | undefined) ?? FALLBACK_KEY;

/** True once the project credentials are present in the environment. */
export const isSupabaseConfigured = Boolean(url && key);


/**
 * Browser Supabase client. Safe to import from components only.
 * Session is persisted in localStorage and auto-refreshed.
 */
export const supabase: SupabaseClient = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "portfolio-admin-auth",
  },
});
