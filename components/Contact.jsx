"use client";

import { useState } from "react";
import Script from "next/script";
import Reveal from "./Reveal";
import ContactModal from "./ContactModal";

export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="contact" id="contact">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div className="wrap">
        <Reveal>
          <p className="label" style={{ color: "var(--accent)" }}>Have something difficult to build?</p>
          <button type="button" className="contact-trigger" onClick={() => setModalOpen(true)}>
            <h2>
              Let&apos;s make
              <br />
              it work.
            </h2>
          </button>
          <p>
            Client work, product builds, AI systems, or a technically awkward problem
            that needs a builder.
          </p>
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

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
