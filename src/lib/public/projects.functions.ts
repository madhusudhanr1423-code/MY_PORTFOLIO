import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

/** Public, read-only project shape used by the marketing site. */
export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  technologies: string[];
  cover_image: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  display_order: number;
};

const FALLBACK_URL = "https://tckapqgrmffxquayquvg.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja2FwcWdybWZmeHF1YXlxdXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODQ4OTcsImV4cCI6MjEwMTI2MDg5N30.I5dp52_DFwRm581S4iuth2eUPFdWbe2qnW42ErwHTKc";

export const publicProjectsQueryKey = ["public", "projects"] as const;

export const getPublicProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicProject[]> => {
    const supabase = createClient(
      process.env["SUPABASE_URL"] ?? FALLBACK_URL,
      process.env["SUPABASE_PUBLISHABLE_KEY"] ?? FALLBACK_KEY,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,title,slug,category,description,technologies,cover_image,live_url,github_url,is_featured,display_order",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: String(row.id),
      title: row.title ?? "",
      slug: row.slug ?? "",
      category: row.category ?? null,
      description: row.description ?? null,
      technologies: Array.isArray(row.technologies) ? (row.technologies as string[]) : [],
      cover_image: row.cover_image ?? null,
      live_url: row.live_url ?? null,
      github_url: row.github_url ?? null,
      is_featured: Boolean(row.is_featured),
      display_order: Number(row.display_order ?? 0),
    }));
  },
);
