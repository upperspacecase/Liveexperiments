"use client";

import type { MergedProject } from "@/lib/projects";
import StatusDot from "./StatusDot";
import { formatRelativeTime } from "@/lib/time";

export default function NowCard({ project }: { project: MergedProject }) {
  const timestamp = project.lastDeployedAt
    ? formatRelativeTime(project.lastDeployedAt)
    : undefined;

  // Calculate "Day X of 90" based on last deploy (approximation)
  const dayCount = project.lastDeployedAt
    ? Math.max(
        1,
        Math.ceil((Date.now() - project.lastDeployedAt) / (1000 * 60 * 60 * 24))
      )
    : null;

  return (
    <section id="now" style={{ marginBottom: "var(--section-spacing)" }}>
      <article
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--card-radius)",
          padding: "var(--card-padding)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--card-gap)",
          animation: "fadeUp 0.6s ease both",
        }}
      >
        {/* Left: text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div>
            <StatusDot status={project.status} timestamp={timestamp} />
            <h2
              style={{
                fontSize: "var(--heading-large)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                marginTop: "1rem",
                lineHeight: 1.1,
              }}
            >
              {project.displayName}
            </h2>
            <p
              style={{
                fontSize: "var(--heading-small)",
                color: "var(--text-secondary)",
                marginTop: "0.75rem",
                fontWeight: 400,
              }}
            >
              {project.tagline}
            </p>
          </div>

          {project.hypothesis && (
            <p
              style={{
                fontSize: "var(--body)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                borderLeft: "2px solid var(--border)",
                paddingLeft: "1rem",
              }}
            >
              {project.hypothesis}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {dayCount && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--mono-size)",
                  color: "var(--text-tertiary)",
                }}
              >
                Day {dayCount} of 90
              </span>
            )}

            {project.productionUrl && (
              <a
                href={project.productionUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "var(--caption)",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Visit site
                <span aria-hidden="true" style={{ fontSize: "1rem" }}>
                  →
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Right: OG image */}
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            aspectRatio: "16/9",
            backgroundColor: "var(--bg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.ogImage ?? "/fallback-card.svg"}
            alt={`${project.displayName} preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 6s ease",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
        </div>
      </article>
    </section>
  );
}
