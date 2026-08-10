import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { AdminPage } from "@/components/admin/admin-shell";
import { listResumeFiles, resumeQueryKey, uploadResume } from "@/lib/admin/resume";
import { getSettings, settingsQueryKey } from "@/lib/admin/settings";

const title = "Resume · Admin";
const description = "Upload and manage the downloadable resume file.";

export const Route = createFileRoute("/_authenticated/admin/resume")({
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
  component: ResumePage,
});

function formatBytes(size: number | null) {
  if (!size) return null;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ResumePage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);

  const files = useQuery({ queryKey: resumeQueryKey, queryFn: listResumeFiles });
  const settings = useQuery({ queryKey: settingsQueryKey, queryFn: getSettings });

  const mutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: async () => {
      setDone(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: resumeQueryKey }),
        queryClient.invalidateQueries({ queryKey: settingsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["public", "settings"] }),
      ]);
    },
  });

  const current = files.data?.[0] ?? null;

  return (
    <AdminPage
      eyebrow="Assets"
      title="Resume Management"
      description="Upload a new resume, review the active version and control what the public download serves."
    >
      <div className="edge-card space-y-6 rounded-2xl p-6 sm:p-7">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Current resume
          </p>
          {files.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : files.error ? (
            <p role="alert" className="text-sm text-destructive">
              {(files.error as Error).message}
            </p>
          ) : current ? (
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 p-4">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{current.name}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {formatDate(current.updatedAt)}
                  {formatBytes(current.size) ? ` · ${formatBytes(current.size)}` : ""}
                </p>
              </div>
              <a
                href={current.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                View
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Public download URL
          </p>
          <p className="break-all text-sm text-muted-foreground">
            {settings.data?.resume_url || "Not set — upload a PDF to set it."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border/70 pt-5">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setDone(false);
              mutation.mutate(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-70"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload PDF
              </>
            )}
          </button>
          {done && !mutation.isPending ? (
            <p className="text-sm text-primary">Resume replaced and link updated.</p>
          ) : null}
        </div>

        {mutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {(mutation.error as Error).message}
          </p>
        ) : null}
      </div>
    </AdminPage>
  );
}
