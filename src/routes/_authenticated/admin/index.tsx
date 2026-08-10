import { createFileRoute } from "@tanstack/react-router";

import { AdminPage, PlaceholderCard } from "@/components/admin/admin-shell";

const title = "Overview · Admin";
const description = "Private dashboard overview for site content.";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { user } = Route.useRouteContext();

  return (
    <AdminPage
      eyebrow="Dashboard"
      title="Overview"
      description={`Signed in as ${user?.email ?? "owner"}. Stage 2 sets up the admin shell — data wiring lands in the next stages.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceholderCard
          title="Projects"
          body="Counts and recent edits will appear here once projects are wired to the database."
        />
        <PlaceholderCard
          title="Contact Messages"
          body="Unread message totals and the latest enquiries will appear here."
        />
        <PlaceholderCard
          title="Settings"
          body="Site-wide details such as contact info and social links."
        />
        <PlaceholderCard
          title="Resume"
          body="Current resume file, version and upload date."
        />
      </div>
    </AdminPage>
  );
}
