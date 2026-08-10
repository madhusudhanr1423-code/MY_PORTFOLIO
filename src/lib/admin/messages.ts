import { supabase } from "@/integrations/supabase/client";

export type MessageStatus = "unread" | "read" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  service: string | null;
  budget: string | null;
  message: string;
  status: MessageStatus | string | null;
  created_at: string | null;
};

export const messagesQueryKey = ["admin", "contact-messages"] as const;

export async function listMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, service, budget, message, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function setMessageStatus(id: string, status: MessageStatus) {
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
