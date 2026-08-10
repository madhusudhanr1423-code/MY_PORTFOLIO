import { Reveal, SectionHeading } from "./reveal";
import { MagneticLink } from "./magnetic-link";
import portrait from "@/assets/portrait.jpg";

const highlights = [
  {
    title: "Passion for modern web experiences",
    copy: "I care about how a site feels — motion, rhythm and restraint over decoration.",
  },
  {
    title: "Focus on quality",
    copy: "Fewer, better decisions. Every component reviewed before it ships.",
  },
  {
    title: "Attention to detail",
    copy: "Spacing, contrast, focus states and copy hierarchy get the same care as features.",
  },
  {
    title: "Continuous learning",
    copy: "Constantly refining my stack around what genuinely improves outcomes.",
  },
  {
    title: "Performance-driven development",
    copy: "Measured, optimised and tested — not assumed.",
  },
];

export function About() {
  return (
    <section id="about" className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl"
                style={{ background: "var(--gradient-accent)" }}
              />
              <img
                src="MY_PIC1.png"
                alt="Portrait of the developer"
                width={900}
                height={1100}
                loading="lazy"
                className="relative aspect-[4/5] w-full rounded-3xl border border-border object-cover"
              />
              <div className="glass absolute bottom-5 left-5 right-5 rounded-2xl p-4">
                <p className="text-sm font-medium">Building modern experiences for the web</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Freelance Full-Stack Developer · Remote worldwide
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="About"
              title="I design and build websites that earn trust in the first five seconds."
              description="I partner with founders, studios and small teams to turn rough ideas into refined, production-ready products — handling design polish and engineering under one roof."
            />

            <ul className="mt-10 space-y-5">
              {highlights.map((item, index) => (
                <Reveal key={item.title} as="li" delay={index * 0.05}>
                  <div className="border-l border-border pl-5 transition-colors duration-500 hover:border-primary">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <div className="mt-10">
                <MagneticLink href="#contact">Start a project</MagneticLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
