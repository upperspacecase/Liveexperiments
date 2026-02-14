import { createHmac } from "crypto";

export interface DeploymentRecord {
  projectName: string;
  deploymentUrl: string;
  deploymentId: string;
  projectId: string;
  target: string | null;
  status: "building" | "ready" | "succeeded" | "error" | "canceled";
  eventType: string;
  timestamp: string;
  dashboardUrl: string | null;
}

export function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha1", secret).update(rawBody).digest("hex");
  return expected === signature;
}

const EVENT_STATUS_MAP: Record<string, DeploymentRecord["status"]> = {
  "deployment.created": "building",
  "deployment.ready": "ready",
  "deployment.succeeded": "succeeded",
  "deployment.error": "error",
  "deployment.canceled": "canceled",
};

export function parseWebhookPayload(
  body: Record<string, unknown>
): DeploymentRecord | null {
  const eventType = body.type as string | undefined;
  if (!eventType || !EVENT_STATUS_MAP[eventType]) return null;

  const payload = body.payload as Record<string, unknown> | undefined;
  if (!payload) return null;

  const deployment = payload.deployment as Record<string, unknown> | undefined;
  const project = payload.project as Record<string, unknown> | undefined;
  const links = payload.links as Record<string, unknown> | undefined;

  return {
    projectName: (deployment?.name as string) ?? "unknown",
    deploymentUrl: (deployment?.url as string) ?? "",
    deploymentId: (deployment?.id as string) ?? "",
    projectId: (project?.id as string) ?? "",
    target: (payload.target as string) ?? null,
    status: EVENT_STATUS_MAP[eventType],
    eventType,
    timestamp: (body.createdAt as string) ?? new Date().toISOString(),
    dashboardUrl: (links?.deployment as string) ?? null,
  };
}
