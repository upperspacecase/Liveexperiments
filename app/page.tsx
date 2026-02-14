import { getMergedProjects } from "@/lib/projects";
import Header from "@/components/Header";
import NowCard from "@/components/NowCard";
import ExperimentCard from "@/components/ExperimentCard";

export const revalidate = 3600;

export default async function Home() {
  const projects = await getMergedProjects();

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <Header />

      <main
        style={{
          maxWidth: "var(--page-max-width)",
          margin: "0 auto",
          padding: `var(--section-spacing) var(--page-padding)`,
        }}
      >
        {/* Zone 2: Now Card */}
        {featured && <NowCard project={featured} />}

        {/* Zone 3: Experiments Grid */}
        {rest.length > 0 && (
          <section>
            <div
              style={{
                columns: "3 320px",
                columnGap: "var(--card-gap)",
              }}
            >
              {rest.map((project, i) => (
                <ExperimentCard
                  key={project.slug}
                  project={project}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
