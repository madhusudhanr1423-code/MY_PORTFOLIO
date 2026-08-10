import { supabase } from "@/integrations/supabase/client";

export const RESUME_BUCKET = "resume";
export const resumeQueryKey = ["admin", "resume"] as const;

export type ResumeFile = {
  name: string;
  path: string;
  url: string;
  updatedAt: string | null;
  size: number | null;
};

function publicUrl(path: string) {
  return supabase.storage.from(RESUME_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Lists files currently in the resume bucket, newest first. */
export async function listResumeFiles(): Promise<ResumeFile[]> {
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((item) => item.name && !item.name.startsWith("."))
    .map((item) => ({
      name: item.name,
      path: item.name,
      url: publicUrl(item.name),
      updatedAt:
        (item.updated_at as string | undefined) ??
        (item.created_at as string | undefined) ??
        null,
      size: (item.metadata as { size?: number } | null)?.size ?? null,
    }));
}

/**
 * Uploads a PDF, removes every previous file in the bucket and writes the new
 * public URL back into the single `settings` row.
 */
export async function uploadResume(file: File): Promise<ResumeFile> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please choose a PDF file.");
  }

  const existing = await listResumeFiles();
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]+/g, "-")}`;

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(path, file, { contentType: "application/pdf", cacheControl: "3600", upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const stale = existing.map((item) => item.path).filter((p) => p !== path);
  if (stale.length) {
    await supabase.storage.from(RESUME_BUCKET).remove(stale);
  }

  const url = publicUrl(path);

  const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (settingsError) throw new Error(settingsError.message);
  if (!settings?.id) throw new Error("Uploaded, but no settings row found to store the URL.");

  const { error: updateError } = await supabase
    .from("settings")
    .update({ resume_url: url, updated_at: new Date().toISOString() })
    .eq("id", settings.id);
  if (updateError) throw new Error(updateError.message);

  return { name: file.name, path, url, updatedAt: new Date().toISOString(), size: file.size };
}
