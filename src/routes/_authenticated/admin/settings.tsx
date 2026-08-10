import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { AdminPage } from "@/components/admin/admin-shell";
import {
  getSettings,
  settingsQueryKey,
  updateSettings,
  type SettingsInput,
} from "@/lib/admin/settings";

const title = "Settings · Admin";
const description = "Manage site-wide settings and contact details.";

const empty: SettingsInput = {
  hero_title: "",
  hero_subtitle: "",
  email: "",
  phone: "",
  github_url: "",
  linkedin_url: "",
  resume_url: "",
  availability_status: "available",
};

const statuses = ["available", "busy", "unavailable"];

export const Route = createFileRoute("/_authenticated/admin/settings")({
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
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: settingsQueryKey,
    queryFn: getSettings,
  });

  const [values, setValues] = useState<SettingsInput>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data) return;
    setValues({
      hero_title: data.hero_title ?? "",
      hero_subtitle: data.hero_subtitle ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      github_url: data.github_url ?? "",
      linkedin_url: data.linkedin_url ?? "",
      resume_url: data.resume_url ?? "",
      availability_status: data.availability_status ?? "available",
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (next: SettingsInput) => {
      if (!data?.id) throw new Error("No settings row found in the database.");
      await updateSettings(data.id, next);
    },
    onSuccess: async () => {
      setSaved(true);
      await queryClient.invalidateQueries({ queryKey: settingsQueryKey });
      await queryClient.invalidateQueries({ queryKey: ["public", "settings"] });
    },
  });

  const set = (key: keyof SettingsInput) => (value: string) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(values);
  };

  return (
    <AdminPage
      eyebrow="Configuration"
      title="Settings"
      description="Hero copy, contact details, social links and availability status shown on the public site."
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      ) : error ? (
        <p role="alert" className="text-sm text-destructive">
          {(error as Error).message}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="edge-card space-y-5 rounded-2xl p-6 sm:p-7">
          <Field label="Hero title" htmlFor="hero_title">
            <input
              id="hero_title"
              className="field"
              value={values.hero_title ?? ""}
              onChange={(e) => set("hero_title")(e.target.value)}
            />
          </Field>

          <Field label="Hero subtitle" htmlFor="hero_subtitle">
            <textarea
              id="hero_subtitle"
              rows={3}
              className="field resize-none"
              value={values.hero_subtitle ?? ""}
              onChange={(e) => set("hero_subtitle")(e.target.value)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                className="field"
                value={values.email ?? ""}
                onChange={(e) => set("email")(e.target.value)}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <input
                id="phone"
                className="field"
                value={values.phone ?? ""}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="GitHub URL" htmlFor="github_url">
              <input
                id="github_url"
                className="field"
                placeholder="https://github.com/username"
                value={values.github_url ?? ""}
                onChange={(e) => set("github_url")(e.target.value)}
              />
            </Field>
            <Field label="LinkedIn URL" htmlFor="linkedin_url">
              <input
                id="linkedin_url"
                className="field"
                placeholder="https://linkedin.com/in/username"
                value={values.linkedin_url ?? ""}
                onChange={(e) => set("linkedin_url")(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Resume URL" htmlFor="resume_url">
              <input
                id="resume_url"
                className="field"
                value={values.resume_url ?? ""}
                onChange={(e) => set("resume_url")(e.target.value)}
              />
            </Field>
            <Field label="Availability status" htmlFor="availability_status">
              <select
                id="availability_status"
                className="field"
                value={values.availability_status ?? "available"}
                onChange={(e) => set("availability_status")(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {mutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          ) : null}

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
            {saved && !mutation.isPending ? (
              <p className="text-sm text-primary">Saved.</p>
            ) : null}
          </div>
        </form>
      )}
    </AdminPage>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
