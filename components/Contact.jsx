"use client";

import { useState } from "react";
import Script from "next/script";
import Reveal from "./Reveal";

const PROJECT_TYPES = [
  "Client work",
  "Product build",
  "AI systems",
  "Something else",
];

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-slug/intro-call";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  projectType: "",
  message: "",
  website: "", // honeypot — distinct from the real "company" field
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  function openCalendly() {
    if (typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  }

  return (
    <section className="contact" id="contact">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div className="wrap">
        <Reveal>
          <p className="label" style={{ color: "var(--accent)" }}>Have something difficult to build?</p>
          <h2>
            Let&apos;s make
            <br />
            it work.
          </h2>
          <p>
            Client work, product builds, AI systems, or a technically awkward problem
            that needs a builder.
          </p>

          {status === "success" ? (
            <div>
              <p className="form-success">
                Thanks — message sent. I&apos;ll get back to you shortly.
              </p>
              {/* Booking is only offered after a validated submission, so the
                  calendar isn't exposed to casual link-sharing or bots. */}
              {CALENDLY_URL && (
                <div className="contact-alt">
                  <button type="button" className="calendly-link rule-link" onClick={openCalendly}>
                    Prefer to talk it through? Book a call →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Honeypot field, hidden from real users */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
                className="hp-field"
                aria-hidden="true"
              />

              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="projectType">Project type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                  >
                    <option value="">Select one</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status === "error" && (
                <p className="form-error">{errorMsg}</p>
              )}

              <button type="submit" className="submit-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          {status !== "success" && (
            <div className="contact-alt">
              <a className="mail rule-link" href="mailto:hello@forkliftlabs.dev">hello@forkliftlabs.dev</a>
            </div>
          )}
        </Reveal>

        <footer className="site-footer">
          <span className="label">Forklift Labs / Engineering practice</span>
          <span className="label">2026</span>
          <span className="social">
            <a className="label rule-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a className="label rule-link" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </span>
        </footer>
      </div>
    </section>
  );
}
