import { Loader2, Plus, Upload, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  slugify,
  uploadProjectImage,
  type Project,
  type ProjectInput,
} from "@/lib/admin/projects";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/70 focus:border-primary/60";

const labelClass = "block text-xs uppercase tracking-[0.16em] text-muted-foreground";

function toInput(project: Project | null): ProjectInput {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? "",
    description: project?.description ?? "",
    technologies: project?.technologies ?? [],
    cover_image: project?.cover_image ?? null,
    gallery_images: project?.gallery_images ?? [],
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    is_featured: project?.is_featured ?? false,
    display_order: project?.display_order ?? 0,
  };
}

export function ProjectForm({
  project,
  submitting,
  onCancel,
  onSubmit,
}: {
  project: Project | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (input: ProjectInput) => void;
}) {
  const [form, setForm] = useState<ProjectInput>(() => toInput(project));
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [techDraft, setTechDraft] = useState("");
  const [uploading, setUploading] = useState<"cover" | "gallery" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function patch(next: Partial<ProjectInput>) {
    setForm((prev) => ({ ...prev, ...next }));
  }

  function addTech(raw: string) {
    const values = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return;
    setForm((prev) => ({
      ...prev,
      technologies: Array.from(new Set([...prev.technologies, ...values])),
    }));
    setTechDraft("");
  }

  async function handleUpload(kind: "cover" | "gallery", files: FileList | null) {
    if (!files?.length) return;
    setUploading(kind);
    setUploadError(null);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadProjectImage(f)));
      if (kind === "cover") {
        patch({ cover_image: urls[0] ?? null });
      } else {
        setForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, ...urls] }));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const slug = form.slug.trim() || slugify(form.title);
    onSubmit({
      ...form,
      title: form.title.trim(),
      slug,
      category: form.category?.trim() || null,
      description: form.description?.trim() || null,
      live_url: form.live_url?.trim() || null,
      github_url: form.github_url?.trim() || null,
      display_order: Number(form.display_order) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="edge-card rounded-2xl p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {project ? "Edit project" : "Add project"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fields map directly to the projects table.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary/60 hover:bg-primary/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            required
            className={cn(fieldClass, "mt-2")}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              patch(slugTouched ? { title } : { title, slug: slugify(title) });
            }}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            required
            className={cn(fieldClass, "mt-2 font-mono text-xs")}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: e.target.value });
            }}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Category
          </label>
          <input
            id="category"
            className={cn(fieldClass, "mt-2")}
            placeholder="e.g. Web Application"
            value={form.category ?? ""}
            onChange={(e) => patch({ category: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className={cn(fieldClass, "mt-2 resize-y")}
            value={form.description ?? ""}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="tech">
            Technologies
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs"
              >
                {tech}
                <button
                  type="button"
                  aria-label={`Remove ${tech}`}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      technologies: prev.technologies.filter((t) => t !== tech),
                    }))
                  }
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            id="tech"
            className={cn(fieldClass, "mt-2")}
            placeholder="Type a technology and press Enter"
            value={techDraft}
            onChange={(e) => setTechDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTech(techDraft);
              }
            }}
            onBlur={() => addTech(techDraft)}
          />
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Cover image</span>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {form.cover_image ? (
              <div className="relative">
                <img
                  src={form.cover_image}
                  alt="Project cover preview"
                  className="h-24 w-40 rounded-xl border border-border object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove cover image"
                  onClick={() => patch({ cover_image: null })}
                  className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm transition-colors hover:border-primary/60 hover:bg-primary/10">
              {uploading === "cover" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {form.cover_image ? "Replace" : "Upload cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleUpload("cover", e.target.files)}
              />
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Gallery images</span>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {form.gallery_images.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="Gallery preview"
                  className="h-20 w-28 rounded-xl border border-border object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove gallery image"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      gallery_images: prev.gallery_images.filter((g) => g !== url),
                    }))
                  }
                  className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm transition-colors hover:border-primary/60 hover:bg-primary/10">
              {uploading === "gallery" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void handleUpload("gallery", e.target.files)}
              />
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="live_url">
            Live URL
          </label>
          <input
            id="live_url"
            type="url"
            className={cn(fieldClass, "mt-2")}
            placeholder="https://…"
            value={form.live_url ?? ""}
            onChange={(e) => patch({ live_url: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="github_url">
            GitHub URL
          </label>
          <input
            id="github_url"
            type="url"
            className={cn(fieldClass, "mt-2")}
            placeholder="https://github.com/…"
            value={form.github_url ?? ""}
            onChange={(e) => patch({ github_url: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="display_order">
            Display order
          </label>
          <input
            id="display_order"
            type="number"
            className={cn(fieldClass, "mt-2")}
            value={form.display_order}
            onChange={(e) => patch({ display_order: Number(e.target.value) })}
          />
        </div>

        <div className="flex items-end">
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
              checked={form.is_featured}
              onChange={(e) => patch({ is_featured: e.target.checked })}
            />
            Featured on the public site
          </label>
        </div>
      </div>

      {uploadError ? (
        <p role="alert" className="mt-5 text-sm text-destructive">
          {uploadError}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting || uploading !== null}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {project ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-primary/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
