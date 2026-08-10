import { Code2, Globe, LayoutTemplate, Gauge, Plug, Smartphone } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

const services = [
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "End-to-end product builds: database design, authentication, APIs and a polished front end.",
  },
  {
    icon: Globe,
    title: "Business Websites",
    description:
      "Brand-led marketing sites that load fast, rank well and turn visitors into enquiries.",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "High-converting single-page experiences with clear hierarchy and measurable CTAs.",
  },
  {
    icon: Gauge,
    title: "Dashboard Development",
    description:
      "Data-dense admin panels with charts, tables, roles and thoughtful empty states.",
  },
  {
    icon: Plug,
    title: "API Integration",
    description:
      "Payments, email, CRM and third-party services wired up with typed, resilient contracts.",
  },
  {
    icon: Smartphone,
    title: "Responsive UI Development",
    description:
      "Pixel-accurate interfaces from Figma, responsive from 320px up and accessible by default.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Everything needed to ship a serious web presence."
          description="Engage me for a focused launch or as a long-term development partner."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.05} as="article">
              <div className="group h-full rounded-2xl border border-border bg-surface/70 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 text-primary transition-colors duration-500 group-hover:bg-primary/15">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
