import { AnimatePresence, motion } from "motion/react";
import { Check, Github, Linkedin, Mail, MapPin, Clock, Loader2, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/public/contact";
import { availabilityLabel, publicSettingsQueryOptions } from "@/lib/public/settings.queries";
import { Reveal, SectionHeading } from "./reveal";

type Detail = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
};

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}


const projectTypes = [
  "Business Website",
  "Landing Page",
  "Full-Stack Web App",
  "Dashboard",
  "Other",
];

const budgets = ["< $1k", "$1k – $3k", "$3k – $7k", "$7k+"];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const { data: settings } = useSuspenseQuery(publicSettingsQueryOptions());

  const email = settings?.email?.trim() || "hello@madhu.dev";
  const phone = settings?.phone?.trim() || "";
  const github = settings?.github_url?.trim() || "";
  const linkedin = settings?.linkedin_url?.trim() || "";

  const details: Detail[] = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    ...(phone
      ? [
          {
            icon: Phone,
            label: "Phone",
            value: phone,
            href: `tel:${phone.replace(/\s+/g, "")}`,
          } satisfies Detail,
        ]
      : []),
    ...(github
      ? [{ icon: Github, label: "GitHub", value: stripProtocol(github), href: github } satisfies Detail]
      : []),
    ...(linkedin
      ? [
          {
            icon: Linkedin,
            label: "LinkedIn",
            value: stripProtocol(linkedin),
            href: linkedin,
          } satisfies Detail,
        ]
      : []),
    { icon: MapPin, label: "Location", value: "Remote · Worldwide" },
    {
      icon: Clock,
      label: "Availability",
      value: availabilityLabel(settings?.availability_status, "Open for new projects"),
    },
  ];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError(null);
    setStatus("sending");
    try {
      await submitContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        service: String(data.get("projectType") ?? ""),
        budget: String(data.get("budget") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      form.reset();
      setStatus("sent");
    } catch (cause) {
      setStatus("idle");
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Something went wrong. Please try again or email me directly.",
      );
    }
  };


  return (
    <section id="contact" className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something worth showing off."
              description="Tell me about your project and I'll reply within one business day with next steps, timeline and a clear quote."
            />

            <ul className="mt-10 space-y-4">
              {details.map((detail, index) => (
                <Reveal key={detail.label} as="li" delay={index * 0.05}>
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
                      <detail.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="block truncate text-sm font-medium transition-colors hover:text-primary"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="truncate text-sm font-medium">{detail.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14 }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"
                    >
                      <Check className="h-7 w-7" aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-semibold">Message sent</h3>
                    <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                      Thanks for reaching out. I&apos;ll get back to you within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-8 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-primary/10"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Name" htmlFor="name">
                        <input
                          id="name"
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Jane Doe"
                          className="field"
                        />
                      </Field>
                      <Field label="Email" htmlFor="email">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="jane@company.com"
                          className="field"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Project Type" htmlFor="projectType">
                        <select id="projectType" name="projectType" required className="field">
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Budget" htmlFor="budget">
                        <select id="budget" name="budget" required className="field">
                          {budgets.map((budget) => (
                            <option key={budget} value={budget}>
                              {budget}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Message" htmlFor="message">
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="A little about your project, goals and timeline…"
                        className="field resize-none"
                      />
                    </Field>

                    {error ? (
                      <p role="alert" className="text-sm text-destructive">
                        {error}
                      </p>
                    ) : null}


                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-70"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        "Send message"
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
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
