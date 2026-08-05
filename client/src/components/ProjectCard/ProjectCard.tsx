import type { ReactElement } from "react";
import type { IProject } from "../../types/Project";
import styles from "./ProjectCard.module.css";

interface IProjectCardProps
{
    project: IProject;
}

// ProjectCard component displays a single project card with title, description, skills, and links to live site and source code
export function ProjectCard({ project }: IProjectCardProps): ReactElement
{
    return (
        <article className={styles.card}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.skills}>
                {project.skills.map((skill) => (
                    <li key={skill} className={styles.skillTag}>{skill}</li>
                ))}
            </ul>
            <div className={styles.links}>
                {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live site</a>
                )}
                {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Source</a>
                )}
            </div>
        </article>
    );
}
