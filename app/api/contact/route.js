import { Resend } from "resend";
import { NextResponse } from "next/server";

// Constructed lazily inside the handler, not at module scope: `new Resend()`
// throws synchronously when RESEND_API_KEY is unset, which happens during
// Next's build-time page-data collection for this route and fails the whole
// build (not just requests) whenever the env var isn't configured yet.
function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hello@forkliftlabs.dev";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Forklift Labs <onboarding@resend.dev>";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e1d8;font-family:'DM Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8478;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e1d8;font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#171614;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function renderEmailHtml({ name, email, phone, company, country, projectType, message }) {
  return `
  <div style="background:#f3f1ec;padding:32px 16px;font-family:-apple-system,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;">
      <div style="padding:24px 24px 0;">
        <p style="margin:0;font-family:'DM Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a55f20;">New inquiry / forkliftlabs.dev</p>
        <h1 style="margin:8px 0 20px;font-family:Georgia,'Newsreader',serif;font-weight:600;font-size:26px;color:#171614;">${escapeHtml(name)}</h1>
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${renderRow("Email", email)}
        ${renderRow("Phone", phone)}
        ${renderRow("Company", company)}
        ${renderRow("Country", country)}
        ${renderRow("Project type", projectType)}
      </table>
      <div style="padding:20px 24px 24px;">
        <p style="margin:0 0 6px;font-family:'DM Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8478;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#171614;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
      <div style="padding:14px 24px;background:#f3f1ec;border-top:1px solid #e5e1d8;">
        <p style="margin:0;font-size:11px;color:#8a8478;">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
      </div>
    </div>
  </div>`;
}

function renderEmailText({ name, email, phone, company, country, projectType, message }) {
  return [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    country ? `Country: ${country}` : null,
    `Project type: ${projectType || "Not specified"}`,
    "",
    "Message:",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, company, country, projectType, message, website } = body || {};

  // Honeypot: a hidden field named distinctly from the real "company" field
  // above, so a legitimate visitor typing their actual company name never
  // gets mistaken for a bot. Bots that autofill every input still trip it.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("Contact form misconfigured: RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "The contact form isn't set up yet. Email hello@forkliftlabs.dev directly." },
      { status: 500 }
    );
  }

  const fields = { name, email, phone, company, country, projectType, message };

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${projectType ? ` — ${projectType}` : ""}`,
      html: renderEmailHtml(fields),
      text: renderEmailText(fields),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
