const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#top">
          <img src="/logo.svg" alt="" width={28} height={28} />
          Forklift Labs
        </a>
        <nav className="links">
          {nav.map((item) => (
            <a key={item.href} className="label rule-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
