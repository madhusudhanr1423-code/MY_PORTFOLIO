import { Github, ArrowUpRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Reveal, SectionHeading } from "./reveal";
import { publicProjectsQueryOptions } from "@/lib/public/projects.queries";

export function Projects() {
  const { data } = useSuspenseQuery(publicProjectsQueryOptions());
  const featured = data.filter((p) => p.is_featured);
  const projects = featured.length > 0 ? featured : data;

  return (
    <section id="projects" className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Featured Work"
          title="Selected projects built for clarity, speed and conversion."
          description="A mix of premium brand websites and full-stack products. Every build ships with performance budgets, accessible markup and a design system."
        />

        {projects.length === 0 ? (
          <Reveal>
            <p className="mt-16 text-sm leading-relaxed text-muted-foreground">
              New case studies are being prepared. Get in touch to see recent work.
            </p>
          </Reveal>
        ) : (
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}

              delay={index * 0.05}
              as="article"
              className={`group relative ${index === 4 ? "lg:col-span-2" : ""}`}
            >
              <div className={`relative h-full overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-[0_40px_100px_-50px_var(--accent-glow)] ${index === 4 ? "lg:mx-auto lg:max-w-[calc(50%-0.75rem)]" : ""}`}>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "var(--gradient-edge)", mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", maskComposite: "exclude", padding: "1px" }}
                />
                <div className="relative overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={`${project.title} website preview`}
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-secondary/40" aria-hidden="true" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" aria-hidden="true" />
                </div>


                <div className="relative p-6 sm:p-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-primary">
                    {project.category}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{project.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={project.live_url ?? "#contact"}
                      {...(project.live_url
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Live Demo
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-primary/10"
                    >
                    <Github className="h-4 w-4" aria-hidden="true" />
                      GitHub
                    </a>
                     ) : null}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        )}

      </div>
    </section>
  );
}