"use client";

import { useState } from "react";
import type { MergedProject } from "@/lib/projects";
import StatusDot from "./StatusDot";
import { formatRelativeTime } from "@/lib/time";

export default function ExperimentCard({
  project,
  index,
}: {
  project: MergedProject;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const timestamp = project.lastDeployedAt
    ? formatRelativeTime(project.lastDeployedAt)
    : undefined;

  const isArchived = project.status === "archived";
  const hasDetails = project.hypothesis || project.learnings || project.framework;

  return (
    <article
      role={hasDetails ? "button" : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      onClick={() => hasDetails && setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (hasDetails && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`,
        borderRadius: "var(--card-radius)",
        padding: "var(--card-padding)",
        cursor: hasDetails ? "pointer" : "default",
        opacity: isArchived ? 0.65 : 1,
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.04)"
          : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: `all var(--transition)`,
        animation: "fadeUp 0.6s ease both",
        animationDelay: `${index * 60}ms`,
        breakInside: "avoid" as const,
        marginBottom: "var(--card-gap)",
      }}
    >
      {/* OG Image */}
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          aspectRatio: "16/9",
          backgroundColor: "var(--bg)",
          marginBottom: "1.25rem",
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
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
        />
      </div>

      {/* Status + timestamp */}
      <StatusDot status={project.status} timestamp={timestamp} />

      {/* Title */}
      <h3
        style={{
          fontSize: "var(--heading-small)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          marginTop: "0.75rem",
        }}
      >
        {project.displayName}
      </h3>

      {/* Tagline */}
      {project.tagline && (
        <p
          style={{
            fontSize: "var(--body)",
            color: "var(--text-secondary)",
            marginTop: "0.375rem",
            lineHeight: 1.5,
          }}
        >
          {project.tagline}
        </p>
      )}

      {/* Expanded details */}
      {expanded && hasDetails && (
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border)",
            animation: "fadeUp 0.3s ease both",
          }}
        >
          {project.hypothesis && (
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--mono-size)",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                Hypothesis
              </span>
              <p
                style={{
                  fontSize: "var(--body)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {project.hypothesis}
              </p>
            </div>
          )}

          {project.learnings && (
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--mono-size)",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                What happened
              </span>
              <p
                style={{
                  fontSize: "var(--body)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {project.learnings}
              </p>
            </div>
          )}

          {project.framework && (
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--mono-size)",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                Stack
              </span>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--mono-size)",
                  color: "var(--text-secondary)",
                }}
              >
                {project.framework}
              </span>
            </div>
          )}

          {project.productionUrl && (
            <a
              href={project.productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "var(--caption)",
                fontWeight: 500,
                color: "var(--text-primary)",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                marginTop: "0.25rem",
              }}
            >
              Visit site
              <span aria-hidden="true" style={{ fontSize: "1rem" }}>
                →
              </span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
