import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { usePageMeta } from "../../hooks/usePageMeta";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import styles from "./Projects.module.css";

export function Projects(): ReactElement
{
    usePageMeta(
        "Projects | Vincenzo R.",
        "A selection of projects built by Vincenzo R., spanning full-stack web apps, tools, and experiments."
    );

    const { projects, isLoading, error } = useProjects();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    if (!isLoading && !showProjects)
    {
        return <Navigate to="/" replace/>;
    }

    return (
        <section className={styles.projects} aria-labelledby="projects-heading">
            <h1 id="projects-heading">Projects</h1>

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
    );
}
