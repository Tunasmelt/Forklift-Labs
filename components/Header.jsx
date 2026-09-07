"use client";

import { useEffect, useState } from "react";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Labs", href: "#labs" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock background scroll while the mobile menu is open, and let Escape
  // close it — the panel otherwise behaves like an inline dropdown, not a
  // modal, so this is the only affordance it needs beyond a link click.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#top" onClick={() => setMenuOpen(false)}>
          <img src="/logo.svg" alt="" width={34} height={34} />
          Forklift Labs
        </a>

        <nav className="links">
          {nav.map((item) => (
            <a key={item.href} className="label rule-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <div className="wrap">
          {nav.map((item) => (
            <a
              key={item.href}
              className="label"
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
