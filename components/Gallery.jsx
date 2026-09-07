"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";

export default function Gallery() {
  const [active, setActive] = useState(null);

  // Exactly two copies + a pure-CSS keyframe translating by -50% of the
  // track's own width. Two identical halves means -50% always lands exactly
  // on the start of the second copy, so the loop is seamless by construction
  // — no JS math over scrollWidth/gaps that can drift or snap.
  const loop = [...projects, ...projects];

  return (
    <section className="gallery-wrap" id="work">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Selected work</h2>
          <span>
            <span className="hover-hint">Hover to pause / click to open</span>
            <span className="touch-hint">Tap to open</span>
          </span>
        </Reveal>
      </div>
      <div className="marquee-viewport">
        <div className="marquee-track">
          {loop.map((project, i) => (
            <ProjectCard key={`${project.slug}-${i}`} project={project} onOpen={setActive} />
          ))}
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
