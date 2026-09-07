"use client";

import { useEffect, useState } from "react";

const CLOSE_MS = 350;
const PROJECT_TYPES = ["Client work", "Product build", "AI systems", "Something else"];
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

export default function ContactModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => {
      setMounted(false);
      // Reset once the close animation finishes so a reopen starts clean.
      setForm(initialForm);
      setStatus("idle");
      setErrorMsg("");
    }, CLOSE_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

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

  if (!mounted) return null;

  return (
    <div
      className={`modal-overlay ${visible ? "open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card contact-modal-card">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">✕</button>

        {status === "success" ? (
          <div className="contact-modal-success">
            <p className="label" style={{ color: "var(--accent)" }}>Message sent</p>
            <h2>Thanks — I&apos;ll get back to you shortly.</h2>
            {CALENDLY_URL && (
              <button type="button" className="calendly-link rule-link" onClick={openCalendly}>
                Prefer to talk it through? Book a call →
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="label" style={{ color: "var(--accent)" }}>Have something difficult to build?</p>
            <h2>Let&apos;s make it work.</h2>
            <p className="contact-modal-intro">
              Client work, product builds, AI systems, or a technically awkward problem
              that needs a builder.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
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
                  <label htmlFor="modal-name">Name</label>
                  <input id="modal-name" name="name" type="text" value={form.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="modal-email">Email</label>
                  <input id="modal-email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="modal-phone">Phone number</label>
                  <input id="modal-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="modal-country">Country</label>
                  <input id="modal-country" name="country" type="text" value={form.country} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="modal-company">Company</label>
                  <input id="modal-company" name="company" type="text" value={form.company} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="modal-projectType">Project type</label>
                  <select id="modal-projectType" name="projectType" value={form.projectType} onChange={handleChange}>
                    <option value="">Select one</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="modal-message">Message</label>
                <textarea id="modal-message" name="message" rows={5} value={form.message} onChange={handleChange} required />
              </div>

              {status === "error" && <p className="form-error">{errorMsg}</p>}

              <button type="submit" className="submit-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>

            <div className="contact-alt">
              <a className="mail rule-link" href="mailto:hello@forkliftlabs.dev">hello@forkliftlabs.dev</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
