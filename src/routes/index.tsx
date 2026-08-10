import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Projects } from "@/components/site/projects";
import { Services } from "@/components/site/services";
import { Process } from "@/components/site/process";
import { WhyWorkWithMe } from "@/components/site/why-me";
import { TechStack } from "@/components/site/tech-stack";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { publicProjectsQueryOptions } from "@/lib/public/projects.queries";
import { publicSettingsQueryOptions } from "@/lib/public/settings.queries";


const title = "Madhu · Full-Stack Web Developer & Web Experience Designer";
const description =
  "Freelance full-stack web developer building premium, high-performance websites and web apps with React, Next.js, TypeScript and Tailwind CSS.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(publicProjectsQueryOptions());
    context.queryClient.ensureQueryData(publicSettingsQueryOptions());
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <p role="alert" className="text-sm text-muted-foreground">
        {error.message}
      </p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="text-sm text-muted-foreground">Page not found.</p>
    </div>
  ),
});


function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Process />
        <WhyWorkWithMe />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Madhu",
            jobTitle: "Full-Stack Web Developer",
            description,
            knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
          }),
        }}
      />
    </div>
  );
}
