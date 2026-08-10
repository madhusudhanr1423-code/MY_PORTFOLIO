import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Loader2, Mail, MailOpen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminPage } from "@/components/admin/admin-shell";
import {
  deleteMessage,
  listMessages,
  messagesQueryKey,
  setMessageStatus,
  type ContactMessage,
  type MessageStatus,
} from "@/lib/admin/messages";
import { cn } from "@/lib/utils";

const title = "Contact Messages · Admin";
const description = "Read enquiries submitted through the contact form.";

type Tab = "unread" | "all" | "archived";

const tabs: { key: Tab; label: string }[] = [
  { key: "unread", label: "Unread" },
  { key: "all", label: "All" },
  { key: "archived", label: "Archived" },
];

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function MessagesScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: messagesQueryKey,
    queryFn: listMessages,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      setMessageStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: messagesQueryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      setConfirmDeleteId(null);
      setOpenId(null);
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
    },
  });

  const visible = messages.filter((m) => {
    if (tab === "archived") return m.status === "archived";
    if (tab === "unread") return m.status === "unread";
    return m.status !== "archived";
  });

  const open = messages.find((m) => m.id === openId) ?? null;

  // Mark as read automatically when opened.
  useEffect(() => {
    if (open && open.status === "unread") {
      statusMutation.mutate({ id: open.id, status: "read" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open?.id]);

  const counts = {
    unread: messages.filter((m) => m.status === "unread").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };

  return (
    <AdminPage
      eyebrow="Inbox"
      title="Contact Messages"
      description="Every enquiry from the public contact form, with read state and archive controls."
    >
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
              tab === t.key
                ? "border-primary/60 bg-primary/12 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {t.label}
            {t.key === "unread" && counts.unread ? (
              <span className="ml-2 text-xs text-primary">{counts.unread}</span>
            ) : null}
            {t.key === "archived" && counts.archived ? (
              <span className="ml-2 text-xs text-muted-foreground">{counts.archived}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="edge-card flex items-center gap-3 rounded-2xl p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading messages…
          </div>
        ) : error ? (
          <div className="edge-card rounded-2xl p-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        ) : visible.length === 0 ? (
          <div className="edge-card rounded-2xl p-6 text-sm text-muted-foreground">
            No messages here yet.
          </div>
        ) : (
          visible.map((m) => <Row key={m.id} message={m} onOpen={() => setOpenId(m.id)} onStatus={(status) => statusMutation.mutate({ id: m.id, status })} onDelete={() => setConfirmDeleteId(m.id)} />)
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-5 backdrop-blur-sm sm:p-10">
          <div className="glass w-full max-w-2xl rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {formatDate(open.created_at)}
                </p>
                <h2 className="font-display mt-1 truncate text-2xl font-semibold tracking-tight">
                  {open.name}
                </h2>
                <a
                  href={`mailto:${open.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {open.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Meta label="Project type" value={open.service ?? "—"} />
              <Meta label="Budget" value={open.budget ?? "—"} />
            </div>

            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {open.message}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <ActionButton
                onClick={() =>
                  statusMutation.mutate({
                    id: open.id,
                    status: open.status === "unread" ? "read" : "unread",
                  })
                }
                icon={open.status === "unread" ? MailOpen : Mail}
                label={open.status === "unread" ? "Mark as read" : "Mark as unread"}
              />
              <ActionButton
                onClick={() =>
                  statusMutation.mutate({
                    id: open.id,
                    status: open.status === "archived" ? "read" : "archived",
                  })
                }
                icon={Archive}
                label={open.status === "archived" ? "Unarchive" : "Archive"}
              />
              <ActionButton
                onClick={() => setConfirmDeleteId(open.id)}
                icon={Trash2}
                label="Delete"
                danger
              />
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-5 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-3xl p-6">
            <h2 className="text-lg font-semibold tracking-tight">Delete this message?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently removes the enquiry. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(confirmDeleteId)}
                disabled={deleteMutation.isPending}
                className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  danger,
}: {
  onClick: () => void;
  icon: typeof Mail;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        danger
          ? "border-destructive/40 text-destructive hover:bg-destructive/10"
          : "border-border hover:border-primary/60 hover:bg-primary/10",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function Row({
  message,
  onOpen,
  onStatus,
  onDelete,
}: {
  message: ContactMessage;
  onOpen: () => void;
  onStatus: (status: MessageStatus) => void;
  onDelete: () => void;
}) {
  const unread = message.status === "unread";
  const archived = message.status === "archived";

  return (
    <div
      className={cn(
        "edge-card rounded-2xl p-5 transition-colors duration-300",
        unread ? "border-primary/40 bg-primary/[0.06]" : "",
        archived ? "opacity-60" : "",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            {unread ? (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
            <p className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>
              {message.name}
            </p>
            <span className="truncate text-xs text-muted-foreground">{message.email}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDate(message.created_at)}
            {message.service ? ` · ${message.service}` : ""}
            {message.budget ? ` · ${message.budget}` : ""}
            {archived ? " · Archived" : ""}
          </p>
        </button>

        <div className="flex shrink-0 gap-2">
          <IconAction
            label={unread ? "Mark as read" : "Mark as unread"}
            icon={unread ? MailOpen : Mail}
            onClick={() => onStatus(unread ? "read" : "unread")}
          />
          <IconAction
            label={archived ? "Unarchive" : "Archive"}
            icon={Archive}
            onClick={() => onStatus(archived ? "read" : "archived")}
          />
          <IconAction label="Delete" icon={Trash2} onClick={onDelete} danger />
        </div>
      </div>
    </div>
  );
}

function IconAction({
  label,
  icon: Icon,
  onClick,
  danger,
}: {
  label: string;
  icon: typeof Mail;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300",
        danger
          ? "border-destructive/40 text-destructive hover:bg-destructive/10"
          : "border-border hover:border-primary/60 hover:bg-primary/10",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export const Route = createFileRoute("/_authenticated/admin/messages")({
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
  component: MessagesScreen,
});
