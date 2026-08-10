import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Compass, PenTool, Code, TestTube, Rocket } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

const steps = [
  { icon: Compass, title: "Discover", copy: "Goals, audience, scope and success metrics." },
  { icon: PenTool, title: "Design", copy: "Wireframes to a polished, on-brand design system." },
  { icon: Code, title: "Develop", copy: "Typed, component-driven build with clean architecture." },
  { icon: TestTube, title: "Test", copy: "Cross-device QA, accessibility and performance passes." },
  { icon: Rocket, title: "Deploy", copy: "Launch, analytics, SEO checks and handover." },
];

export function Process() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <section className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Process"
          title="A calm, predictable path from idea to launch."
        />

        <div ref={ref} className="relative mt-16">
          <div className="absolute left-[22px] top-0 h-full w-px bg-border md:left-0 md:top-[26px] md:h-px md:w-full" aria-hidden="true">
            <motion.div
              style={{ scaleX }}
              className="hidden h-px w-full origin-left bg-primary md:block"
            />
          </div>

          <ol className="relative grid gap-8 md:grid-cols-5 md:gap-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} as="li" delay={index * 0.08} className="relative flex gap-5 md:block">
                <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="md:mt-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
