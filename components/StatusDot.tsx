import type { ProjectStatus } from "@/lib/projects";

const statusColors: Record<ProjectStatus, string> = {
  live: "var(--status-live)",
  building: "var(--status-building)",
  paused: "var(--status-paused)",
  archived: "var(--status-archived)",
};

const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  building: "Building",
  paused: "Paused",
  archived: "Archived",
};

export default function StatusDot({
  status,
  timestamp,
}: {
  status: ProjectStatus;
  timestamp?: string;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: statusColors[status],
          display: "inline-block",
          flexShrink: 0,
          animation:
            status === "live" ? "pulse 3s ease-in-out infinite" : undefined,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--mono-size)",
          color: "var(--text-secondary)",
          letterSpacing: "0.02em",
        }}
      >
        {statusLabels[status]}
        {timestamp && (
          <span style={{ color: "var(--text-tertiary)" }}>
            {" "}
            · {timestamp}
          </span>
        )}
      </span>
    </span>
  );
}
