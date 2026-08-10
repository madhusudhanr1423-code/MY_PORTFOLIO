import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();

  return (
    <AdminShell email={user?.email}>
      <Outlet />
    </AdminShell>
  );
}
