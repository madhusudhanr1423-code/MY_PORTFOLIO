import { supabase } from "@/integrations/supabase/client";

export type ContactMessageInput = {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
};

// Deliberately simple: catches obviously malformed input without rejecting
// valid-but-unusual addresses. The HTML5 type="email" input already guides
// normal users; this is a server-side backstop for direct API calls.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Inserts a public contact enquiry. Status defaults to 'unread' in the database. */
export async function submitContactMessage(input: ContactMessageInput) {
  const payload = {
    name: input.name.trim().slice(0, 100),
    email: input.email.trim().slice(0, 255),
    service: input.service.trim().slice(0, 100),
    budget: input.budget.trim().slice(0, 100),
    message: input.message.trim().slice(0, 2000),
  };

  if (!payload.name || !payload.email || !payload.message) {
    throw new Error("Please fill in your name, email and message.");
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    throw new Error("Please enter a valid email address.");
  }

  const { error } = await supabase.from("contact_messages").insert(payload);
  if (error) throw new Error(error.message);
}
