import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MagneticLink } from "./magnetic-link";
import { staggerChild, staggerParent } from "./reveal";
import { availabilityLabel, publicSettingsQueryOptions } from "@/lib/public/settings.queries";

const DEFAULT_TITLE =
  "Building premium web experiences that combine modern design with scalable development.";
const DEFAULT_SUBTITLE =
  "I'm a Full-Stack Web Developer specializing in creating high-performance websites and web applications using React, Next.js, TypeScript, Tailwind CSS, and modern backend technologies.";

const badges = [
  { label: "React", className: "left-[4%] top-[24%]" },
  { label: "Next.js", className: "right-[6%] top-[18%]" },
  { label: "TypeScript", className: "left-[7%] bottom-[24%]" },
  { label: "Tailwind CSS", className: "right-[6%] bottom-[28%]" },
  { label: "Supabase", className: "right-[3%] top-[52%]" },
  { label: "Node.js", className: "left-[3%] top-[44%]" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const { data: settings } = useSuspenseQuery(publicSettingsQueryOptions());
  const heroTitle = settings?.hero_title?.trim() || DEFAULT_TITLE;
  const heroSubtitle = settings?.hero_subtitle?.trim() || DEFAULT_SUBTITLE;
  const availability = availabilityLabel(
    settings?.availability_status,
    "Available for freelance projects",
  );
  const sectionRef = useRef<HTMLElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 40 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setGlow({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <div className="grid-backdrop absolute inset-0 [mask-image:radial-gradient(80%_60%_at_50%_35%,black,transparent)]" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(560px circle at ${glow.x}% ${glow.y}%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[280px] w-[340px] -translate-x-1/2 rounded-full opacity-25 blur-[110px] sm:h-[420px] sm:w-[640px] sm:opacity-30 lg:h-[520px] lg:w-[820px]"
        style={{ background: "var(--gradient-accent)" }}
      />

      {badges.map((badge, index) => (
        <motion.span
          key={badge.label}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.09, duration: 0.6 }}
          className={`glass animate-float pointer-events-none absolute hidden rounded-full px-4 py-2 text-xs text-muted-foreground lg:block ${badge.className}`}
          style={{ animationDelay: `${index * 0.7}s` }}
        >
          {badge.label}
        </motion.span>
      ))}

      <motion.div
        style={{ y: parallax }}
        className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8"
      >
        <motion.div variants={staggerParent} initial="hidden" animate="show">
          <motion.div variants={staggerChild} className="flex justify-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {availability}
            </span>
          </motion.div>

          <motion.h1
            variants={staggerChild}
            className="text-gradient mx-auto mt-8 max-w-4xl text-balance text-[2.15rem] font-semibold leading-[1.06] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            variants={staggerChild}
            className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticLink href="#projects" className="w-full sm:w-auto">
              View Projects
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </MagneticLink>
            <MagneticLink href="#contact" variant="ghost" className="w-full sm:w-auto">
              Let&apos;s Work Together
            </MagneticLink>
          </motion.div>
        </motion.div>

        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Scroll
          <motion.span
            animate={reduce ? { y: 0 } : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
