import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href: string;
  variant?: "solid" | "ghost";
  className?: string;
  download?: boolean;
  ariaLabel?: string;
};

export function MagneticLink({
  children,
  href,
  variant = "solid",
  className,
  download = false,
  ariaLabel = "",
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(download ? { download: true } : {})}
      onMouseMove={(event) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setOffset({
          x: (event.clientX - (rect.left + rect.width / 2)) * 0.18,
          y: (event.clientY - (rect.top + rect.height / 2)) * 0.28,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300",
        variant === "solid"
          ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
          : "border border-border bg-transparent text-foreground hover:border-primary/60 hover:bg-primary/10",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
