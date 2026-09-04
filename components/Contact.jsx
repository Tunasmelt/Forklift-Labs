import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section className="contact" id="contact">
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
          <a className="mail rule-link" href="mailto:hello@forkliftlabs.dev">hello@forkliftlabs.dev</a>
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
