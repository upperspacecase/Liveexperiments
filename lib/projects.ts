import { getLatestDeploymentsByProject } from "./deployments";
import { fetchOgImage } from "./vercel";
import projectsData from "@/data/projects.json";

export type ProjectStatus = "live" | "building" | "paused" | "archived";

export interface ManualProject {
  vercelProjectName: string;
  displayName: string;
  status: ProjectStatus;
  tagline: string;
  hypothesis?: string;
  learnings?: string;
  featured?: boolean;
}

export interface MergedProject {
  slug: string;
  displayName: string;
  status: ProjectStatus;
  tagline: string;
  hypothesis?: string;
  learnings?: string;
  featured: boolean;
  framework: string | null;
  productionUrl: string | null;
  lastDeployedAt: number | null;
  ogImage: string | null;
}

export async function getMergedProjects(): Promise<MergedProject[]> {
  const deploymentMap = await getLatestDeploymentsByProject();
  const manual = projectsData as ManualProject[];

  const manualMap = new Map<string, ManualProject>();
  for (const m of manual) {
    manualMap.set(m.vercelProjectName, m);
  }

  const merged: MergedProject[] = [];
  const seen = new Set<string>();

  // First: merge webhook deployment data with manual data
  for (const [name, dep] of deploymentMap) {
    seen.add(name);
    const m = manualMap.get(name);

    const productionUrl = dep.deploymentUrl
      ? `https://${dep.deploymentUrl}`
      : null;

    const ogImage = productionUrl
      ? await fetchOgImage(productionUrl)
      : null;

    merged.push({
      slug: name,
      displayName: m?.displayName ?? name,
      status: m?.status ?? "live",
      tagline: m?.tagline ?? "",
      hypothesis: m?.hypothesis,
      learnings: m?.learnings,
      featured: m?.featured ?? false,
      framework: null,
      productionUrl,
      lastDeployedAt: dep.timestamp ? new Date(dep.timestamp).getTime() : null,
      ogImage,
    });
  }

  // Second: manual-only projects (no webhook data yet)
  for (const m of manual) {
    if (!seen.has(m.vercelProjectName)) {
      merged.push({
        slug: m.vercelProjectName,
        displayName: m.displayName,
        status: m.status,
        tagline: m.tagline,
        hypothesis: m.hypothesis,
        learnings: m.learnings,
        featured: m.featured ?? false,
        framework: null,
        productionUrl: null,
        lastDeployedAt: null,
        ogImage: null,
      });
    }
  }

  // Sort: featured first, then by status priority, then by last deploy
  const statusOrder: Record<ProjectStatus, number> = {
    live: 0,
    building: 1,
    paused: 2,
    archived: 3,
  };

  merged.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const sa = statusOrder[a.status] ?? 99;
    const sb = statusOrder[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    return (b.lastDeployedAt ?? 0) - (a.lastDeployedAt ?? 0);
  });

  return merged;
}
