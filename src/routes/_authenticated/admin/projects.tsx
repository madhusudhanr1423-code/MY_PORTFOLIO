import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminPage } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import {
  createProject,
  deleteProject,
  listProjects,
  persistOrder,
  projectsQueryKey,
  setFeatured,
  updateProject,
  type Project,
  type ProjectInput,
} from "@/lib/admin/projects";
import { cn } from "@/lib/utils";

const title = "Projects · Admin";
const description = "Manage portfolio project entries.";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<{ kind: "list" } | { kind: "form"; project: Project | null }>({
    kind: "list",
  });
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const projects = useQuery({ queryKey: projectsQueryKey, queryFn: listProjects });

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: projectsQueryKey });
  }

  function handleError(err: unknown) {
    setError(err instanceof Error ? err.message : "Something went wrong");
  }

  const save = useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: ProjectInput }) =>
      id ? updateProject(id, input) : createProject(input),
    onSuccess: async (_data, variables) => {
      setError(null);
      setNotice(variables.id ? "Project updated." : "Project created.");
      setMode({ kind: "list" });
      await invalidate();
    },
    onError: handleError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: async () => {
      setError(null);
      setNotice("Project deleted.");
      setConfirmDelete(null);
      await invalidate();
    },
    onError: handleError,
  });

  const feature = useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) => setFeatured(id, value),
    onSuccess: async () => {
      setError(null);
      await invalidate();
    },
    onError: handleError,
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => persistOrder(ids),
    onSuccess: async () => {
      setError(null);
      await invalidate();
    },
    onError: handleError,
  });

  const rows = projects.data ?? [];

  function move(index: number, direction: -1 | 1) {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    reorder.mutate(next.map((p) => p.id));
  }

  if (mode.kind === "form") {
    return (
      <AdminPage
        eyebrow="Content"
        title={mode.project ? "Edit project" : "New project"}
        description="Changes are saved straight to your database. Images upload to the project-images bucket."
      >
        {error ? (
          <p role="alert" className="mb-5 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <ProjectForm
          project={mode.project}
          submitting={save.isPending}
          onCancel={() => setMode({ kind: "list" })}
          onSubmit={(input) =>
            save.mutate(mode.project ? { id: mode.project.id, input } : { input })
          }
        />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      eyebrow="Content"
      title="Projects"
      description="Create, edit, reorder and feature the projects shown on the public site."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setError(null);
            setMode({ kind: "form", project: null });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
        {reorder.isPending || feature.isPending ? (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
          </span>
        ) : null}
      </div>

      {notice ? <p className="mb-5 text-sm text-primary">{notice}</p> : null}
      {error ? (
        <p role="alert" className="mb-5 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {projects.isLoading ? (
        <div className="edge-card flex items-center gap-3 rounded-2xl p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading projects…
        </div>
      ) : rows.length === 0 ? (
        <div className="edge-card rounded-2xl p-6 sm:p-7">
          <h2 className="text-base font-semibold tracking-tight">No projects yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Add your first project and it will appear here, ordered by display order.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((project, index) => (
            <li
              key={project.id}
              className="edge-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${project.title} up`}
                    disabled={index === 0 || reorder.isPending}
                    onClick={() => move(index, -1)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:opacity-40"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${project.title} down`}
                    disabled={index === rows.length - 1 || reorder.isPending}
                    onClick={() => move(index, 1)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:opacity-40"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={`${project.title} cover`}
                    className="hidden h-16 w-24 shrink-0 rounded-xl border border-border object-cover sm:block"
                    loading="lazy"
                  />
                ) : (
                  <div className="hidden h-16 w-24 shrink-0 rounded-xl border border-dashed border-border sm:block" />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight">{project.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {project.category ?? "Uncategorised"} · order {project.display_order ?? 0} ·{" "}
                    <span className="font-mono">{project.slug}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    feature.mutate({ id: project.id, value: !project.is_featured })
                  }
                  aria-pressed={Boolean(project.is_featured)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors",
                    project.is_featured
                      ? "border-primary/60 bg-primary/12 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:bg-primary/10",
                  )}
                >
                  <Star
                    className={cn("h-3.5 w-3.5", project.is_featured ? "text-primary" : "")}
                    aria-hidden="true"
                  />
                  {project.is_featured ? "Featured" : "Not featured"}
                </button>

                <button
                  type="button"
                  aria-label={`Edit ${project.title}`}
                  onClick={() => {
                    setNotice(null);
                    setError(null);
                    setMode({ kind: "form", project });
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary/60 hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label={`Delete ${project.title}`}
                  onClick={() => setConfirmDelete(project)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-destructive/60 hover:bg-destructive/10 hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {confirmDelete ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-5 backdrop-blur"
        >
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight">Delete project?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              “{confirmDelete.title}” will be permanently removed from the database. This cannot be
              undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={remove.isPending}
                onClick={() => remove.mutate(confirmDelete.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
