import fs from "fs/promises";
import path from "path";
import type { DeploymentRecord } from "./webhook";

const STORE_PATH = path.join(process.cwd(), "data", "deployments.json");
const MAX_RECORDS = 200;

export async function readDeployments(): Promise<DeploymentRecord[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as DeploymentRecord[];
  } catch {
    return [];
  }
}

export async function writeDeployment(
  record: DeploymentRecord
): Promise<void> {
  const records = await readDeployments();

  // Prepend new record (most recent first)
  records.unshift(record);

  // Cap the store size
  if (records.length > MAX_RECORDS) {
    records.length = MAX_RECORDS;
  }

  await fs.writeFile(STORE_PATH, JSON.stringify(records, null, 2), "utf-8");
}

export interface LatestDeployment {
  projectName: string;
  deploymentUrl: string;
  target: string | null;
  status: DeploymentRecord["status"];
  timestamp: string;
}

/**
 * Returns the most recent deployment per project name,
 * preferring production targets over preview deployments.
 */
export async function getLatestDeploymentsByProject(): Promise<
  Map<string, LatestDeployment>
> {
  const records = await readDeployments();
  const map = new Map<string, LatestDeployment>();

  for (const r of records) {
    const existing = map.get(r.projectName);

    // Keep the first occurrence per project (records are newest-first).
    // But prefer production over preview if we find one later.
    if (!existing) {
      map.set(r.projectName, {
        projectName: r.projectName,
        deploymentUrl: r.deploymentUrl,
        target: r.target,
        status: r.status,
        timestamp: r.timestamp,
      });
    } else if (
      r.target === "production" &&
      existing.target !== "production"
    ) {
      map.set(r.projectName, {
        projectName: r.projectName,
        deploymentUrl: r.deploymentUrl,
        target: r.target,
        status: r.status,
        timestamp: r.timestamp,
      });
    }
  }

  return map;
}
