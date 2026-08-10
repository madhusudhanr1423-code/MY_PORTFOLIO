import {
  Sparkles,
  FileCode2,
  MonitorSmartphone,
  Search,
  Zap,
  Layers,
  Server,
  LifeBuoy,
} from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

const reasons = [
  { icon: Sparkles, title: "Modern UI", copy: "Interfaces that feel current, considered and premium." },
  { icon: FileCode2, title: "Clean Code", copy: "Typed, readable and easy for any team to extend." },
  { icon: MonitorSmartphone, title: "Responsive Design", copy: "Flawless from small phones to ultrawide displays." },
  { icon: Search, title: "SEO Friendly", copy: "Semantic markup, metadata and structured data." },
  { icon: Zap, title: "Fast Performance", copy: "Lighthouse-led budgets and optimised assets." },
  { icon: Layers, title: "Scalable Architecture", copy: "Structure that grows with your product." },
  { icon: Server, title: "Backend Integration", copy: "Databases, auth, payments and third-party APIs." },
  { icon: LifeBuoy, title: "Ongoing Support", copy: "Post-launch iteration, monitoring and updates." },
];

export function WhyWorkWithMe() {
  return (
    <section className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why Work With Me"
          title="Craft, communication and code you can build on."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.04}>
              <div className="group h-full bg-background p-7 transition-colors duration-500 hover:bg-surface">
                <reason.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-base font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
