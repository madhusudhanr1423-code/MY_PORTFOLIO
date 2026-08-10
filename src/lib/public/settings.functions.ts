import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

/** Public, read-only site settings shape (single row in `settings`). */
export type PublicSettings = {
  hero_title: string | null;
  hero_subtitle: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  availability_status: string | null;
};

const FALLBACK_URL = "https://tckapqgrmffxquayquvg.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja2FwcWdybWZmeHF1YXlxdXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODQ4OTcsImV4cCI6MjEwMTI2MDg5N30.I5dp52_DFwRm581S4iuth2eUPFdWbe2qnW42ErwHTKc";

export const publicSettingsQueryKey = ["public", "settings"] as const;

export const getPublicSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicSettings | null> => {
    const supabase = createClient(
      process.env["SUPABASE_URL"] ?? FALLBACK_URL,
      process.env["SUPABASE_PUBLISHABLE_KEY"] ?? FALLBACK_KEY,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase
      .from("settings")
      .select(
        "hero_title,hero_subtitle,email,phone,github_url,linkedin_url,resume_url,availability_status",
      )
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      hero_title: data.hero_title ?? null,
      hero_subtitle: data.hero_subtitle ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      github_url: data.github_url ?? null,
      linkedin_url: data.linkedin_url ?? null,
      resume_url: data.resume_url ?? null,
      availability_status: data.availability_status ?? null,
    };
  },
);
