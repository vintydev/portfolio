import type { ReactElement } from "react";
import { useProjects } from "../../hooks/useProjects";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import styles from "./Home.module.css";

export function Home(): ReactElement
{
    const { projects, isLoading, error } = useProjects();

    return (
        <>
            <section className={styles.hero}>
                <p className={styles.tagline}>Full-stack developer &middot; .NET &amp; React</p>
                <h1 className={styles.heading}>Vincenzo <em>R.</em></h1>
                <p className={styles.intro}>
                    I build web products end to end &mdash; from ASP.NET Core APIs to React frontends.
                </p>
            </section>

            <section className={styles.projects} aria-labelledby="featured-projects-heading">
                <h2 id="featured-projects-heading">Featured projects</h2>

                {isLoading && <p>Loading projects&hellip;</p>}
                {error && <p role="alert">{error}</p>}

                {!isLoading && !error && (
                    <div className={styles.projectGrid}>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
