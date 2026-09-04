import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="display" style={{ fontSize: 36 }}>About Forklift Labs</h2>
          <span className="label" style={{ color: "var(--muted-foreground)" }}>Small by design</span>
        </Reveal>
        <div className="about">
          <Reveal className="large">
            A direct engineering practice for products that need someone to think about
            the whole system.
          </Reveal>
          <Reveal delay={120} className="about-copy">
            <p>
              Forklift Labs works across product engineering and applied AI —
              architecture, interfaces, backend systems, retrieval, agents, automation
              and the infrastructure around them.
            </p>
            <p>
              The model is intentionally simple: direct communication, full ownership,
              and software that gets shipped rather than merely presented.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
