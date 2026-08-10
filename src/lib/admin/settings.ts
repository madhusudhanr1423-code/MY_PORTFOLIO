import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  availability_status: string | null;
  updated_at?: string | null;
};

export type SettingsInput = Omit<SiteSettings, "id" | "updated_at">;

export const settingsQueryKey = ["admin", "settings"] as const;

const COLUMNS =
  "id, hero_title, hero_subtitle, email, phone, github_url, linkedin_url, resume_url, availability_status, updated_at";

export async function getSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("settings").select(COLUMNS).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as SiteSettings | null;
}

export async function updateSettings(id: string, values: SettingsInput) {
  const { error } = await supabase
    .from("settings")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
