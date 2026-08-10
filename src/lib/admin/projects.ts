import { supabase } from "@/integrations/supabase/client";

/** Row shape of the existing `public.projects` table. */
export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  technologies: string[] | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean | null;
  display_order: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ProjectInput = {
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  technologies: string[];
  cover_image: string | null;
  gallery_images: string[];
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  display_order: number;
};

export const PROJECTS_BUCKET = "project-images";

export const projectsQueryKey = ["admin", "projects"] as const;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function createProject(input: ProjectInput) {
  const { error } = await supabase.from("projects").insert(input);
  if (error) throw new Error(error.message);
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const { error } = await supabase.from("projects").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setFeatured(id: string, is_featured: boolean) {
  await updateProject(id, { is_featured });
}

/** Persist display_order for a full ordered list of ids. */
export async function persistOrder(ids: string[]) {
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("projects").update({ display_order: index + 1 }).eq("id", id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

/** Uploads a file to the project-images bucket and returns its public URL. */
export async function uploadProjectImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large — please choose a file under 5MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(PROJECTS_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(PROJECTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
