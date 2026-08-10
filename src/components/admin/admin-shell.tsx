import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Projects", to: "/admin/projects", icon: FolderKanban },
  { label: "Contact Messages", to: "/admin/messages", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Resume", to: "/admin/resume", icon: FileText },
] as const;

export function AdminShell({
  email,
  children,
}: {
  email?: string | undefined;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleSignOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  const navList = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-300",
              active
                ? "bg-primary/12 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <item.icon
              className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col gap-6 p-5">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Studio</p>
        <p className="font-display mt-1.5 text-lg font-semibold tracking-tight">Madhu · Admin</p>
      </div>

      {navList}

      <div className="border-t border-border pt-4">
        {email ? (
          <p className="truncate px-1 pb-3 text-xs text-muted-foreground" title={email}>
            {email}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl border border-border px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-primary/60 hover:bg-primary/10 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {signingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 grid-backdrop opacity-40" aria-hidden="true" />

      {/* Mobile top bar */}
      <div className="glass sticky top-0 z-40 flex h-16 items-center justify-between px-5 lg:hidden">
        <p className="font-display text-base font-semibold tracking-tight">Madhu · Admin</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary/60 hover:bg-primary/10"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="glass fixed inset-x-0 top-16 z-40 border-b lg:hidden">{sidebarInner}</div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <aside className="sticky top-12 hidden h-[calc(100vh-6rem)] w-64 shrink-0 rounded-2xl lg:block glass">
          {sidebarInner}
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function AdminPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function PlaceholderCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="edge-card rounded-2xl p-6 sm:p-7">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
