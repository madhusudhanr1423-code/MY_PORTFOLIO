import { motion } from "motion/react";
import { SectionHeading, staggerChild, staggerParent } from "./reveal";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Supabase",
  "Node.js",
  "Git",
  "GitHub",
  "Vercel",
  "Framer Motion",
  "Figma",
];

export function TechStack() {
  return (
    <section className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Technology"
          title="A focused, modern toolkit."
          description="Tools chosen for developer velocity, long-term maintainability and great end-user performance."
        />

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {stack.map((tech) => (
            <motion.li
              key={tech}
              variants={staggerChild}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface"
            >
              <span
                aria-hidden="true"
                className="font-display text-lg font-semibold text-primary transition-transform duration-500 group-hover:scale-110"
              >
                {tech.slice(0, 2)}
              </span>
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                {tech}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
