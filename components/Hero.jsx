const capabilities = [
  "Product engineering",
  "Applied AI & agents",
  "Retrieval systems",
  "Backend architecture",
  "Interface design",
  "Automation",
];

export default function Hero() {
  return (
    <section className="hero wrap">
      <div className="hero-top">
        <span className="label" style={{ color: "var(--accent)" }}>Independent engineering practice</span>
        <span className="label" style={{ color: "var(--muted-foreground)" }}>Selected work / 2026</span>
      </div>
      <h1>
        Software, systems
        <br />
        and <em>applied intelligence.</em>
      </h1>
      <div className="hero-second-row">
        <p>
          A selection of client work and self-initiated projects — built to solve real
          problems, explore difficult systems, and make good software feel inevitable.
        </p>
        <ul className="hero-tax" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {capabilities.map((c) => (
            <li key={c} className="label">{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
