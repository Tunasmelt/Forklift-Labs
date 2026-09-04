export default function ProjectCard({ project, onOpen }) {
  return (
    <article className="project">
      <button type="button" onClick={() => onOpen(project)} style={{ width: "100%", display: "block" }}>
        <div className="visual grain">
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="badges">
            {project.tools.map((tool) => (
              <span className="badge" key={tool}>{tool}</span>
            ))}
          </div>
        </div>
        <div className="info">
          <div>
            <span className="label meta">{project.kind}</span>
            <h2>{project.title}</h2>
          </div>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>{project.teaser}</p>
        </div>
      </button>
    </article>
  );
}
