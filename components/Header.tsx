"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--bg)",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        transition: "border-color var(--transition)",
        padding: `1.25rem var(--page-padding)`,
      }}
    >
      <div
        style={{
          maxWidth: "var(--page-max-width)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--heading-large)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            Live Experiments
          </h1>
          <p
            style={{
              fontSize: "var(--body)",
              color: "var(--text-secondary)",
              marginTop: "0.5rem",
              lineHeight: 1.5,
            }}
          >
            Building things that get people offline. Currently in Ericeira,
            Portugal.
          </p>
        </div>
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            paddingTop: "0.5rem",
            flexShrink: 0,
          }}
        >
          {[
            { label: "Now", href: "#now" },
            { label: "GitHub", href: "https://github.com" },
            { label: "Email", href: "mailto:hello@example.com" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: "var(--caption)",
                fontWeight: 400,
                color: "var(--text-secondary)",
                letterSpacing: "0.02em",
                textTransform: "uppercase" as const,
                transition: "color var(--transition)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
