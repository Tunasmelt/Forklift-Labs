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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, projectType, message, company } = body || {};

  // Honeypot: bots tend to fill every field, humans never see/fill this one.
  if (company) {
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

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${projectType ? ` — ${projectType}` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType || "Not specified"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
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
