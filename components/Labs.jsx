import { labs } from "@/data/projects";
import Reveal from "./Reveal";

export default function Labs() {
  return (
    <section className="section" id="labs">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="display" style={{ fontSize: 36 }}>Selected labs</h2>
          <span className="label" style={{ color: "var(--muted-foreground)" }}>
            Own work / technical range
          </span>
        </Reveal>
        <div className="lab-grid">
          {labs.map((lab, i) => (
            <Reveal as="div" key={lab.n} delay={i * 110} className="lab">
              <span className="label n">{lab.n}</span>
              <div>
                <h3>{lab.title}</h3>
                <p>{lab.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
