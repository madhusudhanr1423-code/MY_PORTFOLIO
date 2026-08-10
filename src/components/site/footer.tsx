import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicSettingsQueryOptions } from "@/lib/public/settings.queries";

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const { data: settings } = useSuspenseQuery(publicSettingsQueryOptions());
  const email = settings?.email?.trim() || "hello@madhu.dev";

  const socials = [
    { label: "GitHub", href: settings?.github_url?.trim() || "https://github.com", icon: Github },
    {
      label: "LinkedIn",
      href: settings?.linkedin_url?.trim() || "https://linkedin.com",
      icon: Linkedin,
    },
    { label: "Email", href: `mailto:${email}`, icon: Mail },
  ];

  return (
    <footer className="relative border-t border-border py-14">

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#home" className="font-display text-lg font-semibold">
              Madhu<span className="text-primary"></span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Full-Stack Web Developer building premium, high-performance web experiences.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3 md:grid-cols-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-foreground"
              >
                <social.icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Madhu — All rights reserved.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
