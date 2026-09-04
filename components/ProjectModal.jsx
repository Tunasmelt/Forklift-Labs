"use client";

import { useEffect, useState } from "react";

const CLOSE_MS = 350;

export default function ProjectModal({ project, onClose }) {
  const [mounted, setMounted] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setMounted(project);
      const raf = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
    const t = setTimeout(() => setMounted(null), CLOSE_MS);
    return () => clearTimeout(t);
  }, [project]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;
  const { tag, title, desc, why, arch, image, imageAlt } = mounted;

  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-image">
          <img src={image} alt={imageAlt} onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
        <div className="modal-panel">
          <p className="label modal-tag">{tag}</p>
          <h2>{title}</h2>
          <p>{desc}</p>
          <div>
            <p className="modal-why-label">Why it matters</p>
            <p className="modal-why-body">{why}</p>
          </div>
          <div className="architecture">
            <p className="label architecture-label">Architecture</p>
            <ol>
              {arch.map((step, i) => (
                <li key={step}>
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
