// Public form endpoint for ghlhire.com, run on Supabase Edge Functions so the
// website's forms do not invoke Netlify functions.
//
// POST { kind: 'subscribe' | 'featured' | 'contact', ...fields }
// Always answers 200 with { ok: true } or { ok: false, error } so the browser
// client can show the message without unpacking HTTP errors.
//
// Secrets (Supabase dashboard > Edge Functions > Secrets):
//   RESEND_API_KEY     required for notification emails; without it requests
//                      are still saved and show in the admin console
//   RESEND_FROM_EMAIL  optional, defaults to "GHL Hire <noreply@ghlhire.com>"
//   INBOX_EMAIL        optional, defaults to inquiries@ghlhire.com
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const INBOX = Deno.env.get("INBOX_EMAIL") ?? "inquiries@ghlhire.com";
const FROM = Deno.env.get("RESEND_FROM_EMAIL") ?? "GHL Hire <noreply@ghlhire.com>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ALLOWED_ORIGINS = [
  "https://ghlhire.com",
  "https://www.ghlhire.com",
  "http://localhost:3000",
  "http://localhost:3210",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+--ghlhire\.netlify\.app$/.test(origin));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Best-effort limit per function instance: enough to blunt a simple flood.
const hits = new Map<string, { count: number; reset: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

async function notify(subject: string, html: string, replyTo: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY is not set: request saved, no email sent.");
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [INBOX], reply_to: replyTo, subject, html }),
  });
  if (!response.ok) console.error("Resend error:", response.status, await response.text());
}

Deno.serve(async (req: Request) => {
  const headers = { ...corsHeaders(req.headers.get("origin")), "Content-Type": "application/json" };
  const reply = (body: Record<string, unknown>) => new Response(JSON.stringify(body), { headers });

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ ok: false, error: "POST only." }), { status: 405, headers });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return reply({ ok: false, error: "Too many requests. Please try again in a minute." });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return reply({ ok: false, error: "Invalid request." });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(body.website, 200)) return reply({ ok: true });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const kind = clean(body.kind, 20);
  const email = clean(body.email, 254).toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) return reply({ ok: false, error: "Please enter a valid email address." });

  try {
    if (kind === "subscribe") {
      const interest = body.interest === "employer" ? "employer" : "jobseeker";
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, interest, source: clean(body.source, 60) || null });
      // 23505: already subscribed. Same answer, so the form does not reveal who is on the list.
      if (error && error.code !== "23505") throw error;
      return reply({ ok: true });
    }

    if (kind === "featured" || kind === "contact") {
      const name = clean(body.name, 200);
      let subject: string;
      let lines: string[];
      let metadata: Record<string, unknown>;
      let category = "other";
      let priority = "medium";

      if (kind === "featured") {
        const company = clean(body.company, 200);
        const job = clean(body.job, 500);
        const startDate = clean(body.startDate, 20);
        const notes = clean(body.notes, 2000);
        if (!name || !company || !job) return reply({ ok: false, error: "Please fill in your name, email, company and the job." });
        if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return reply({ ok: false, error: "Please pick a valid start date." });
        subject = `Featured listing request: ${company}`;
        lines = [`From: ${name} <${email}>`, `Company: ${company}`, `Job: ${job}`, `Start date: ${startDate || "not given"}`, "", notes || "(no notes)"];
        metadata = { source: "featured_request", contact_name: name, contact_email: email, company, job, start_date: startDate || null };
        category = "billing";
        priority = "high";
      } else {
        const topic = clean(body.subject, 300);
        const message = clean(body.message, 5000);
        const type = clean(body.type, 30) || "general";
        if (!name || !topic || !message) return reply({ ok: false, error: "Please fill in every field." });
        subject = topic;
        lines = [`From: ${name} <${email}>`, `Inquiry type: ${type}`, "", message];
        metadata = { source: "contact_form", contact_name: name, contact_email: email, inquiry_type: type };
        category = type === "support" ? "technical" : type === "billing" ? "billing" : "other";
      }

      const { data: ticketNumber, error: numberError } = await supabase.rpc("generate_ticket_number");
      if (numberError || !ticketNumber) throw numberError ?? new Error("No ticket number");

      const { error: ticketError } = await supabase.from("support_tickets").insert([
        { ticket_number: ticketNumber, profile_id: null, subject: subject.slice(0, 300), description: lines.join("\n"), category, priority, metadata },
      ]);
      if (ticketError) throw ticketError;

      const tag = kind === "featured" ? "Featured request" : "Contact";
      const next =
        kind === "featured"
          ? "<p>Next step: reply with the rate and a Wise payment link, then switch the job to Featured in the admin console.</p>"
          : "";
      try {
        await notify(`[${tag}] ${subject} (${ticketNumber})`, `<p>${lines.map(escapeHtml).join("<br>")}</p>${next}`, email);
      } catch (emailError) {
        console.error("Notification failed:", emailError);
      }
      return reply({ ok: true, ticket: ticketNumber });
    }

    return reply({ ok: false, error: "Unknown form." });
  } catch (error) {
    console.error("site-forms error:", error);
    return reply({ ok: false, error: `We could not save that just now. Please email ${INBOX} instead.` });
  }
});
