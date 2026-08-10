import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

/**
 * Gate for every admin route. Client-only, because the Supabase session lives
 * in localStorage and is not readable during SSR.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (!isSupabaseConfigured) throw redirect({ to: "/auth" });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
