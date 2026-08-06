import type { ReactElement } from "react";
import { useProjects } from "../../hooks/useProjects";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import styles from "./Home.module.css";

export function Home(): ReactElement
{
    const { projects, isLoading, error } = useProjects();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    return (
        <>
            <section className={styles.hero}>
                <p className={styles.tagline}>Full-stack developer &middot; .NET &amp; React</p>
                <h1 className={styles.heading}>Vincenzo <em>R.</em></h1>
                <p className={styles.intro}>
                    I build web products end to end &mdash; from ASP.NET Core APIs to React frontends.
                </p>
            </section>

            {showProjects && (
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
            )}

            <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
                <h2 id="contact-heading">Get in touch</h2>
                <p className={styles.contactIntro}>
                    Have a project in mind or just want to say hi? Send a message and I&rsquo;ll reply as soon as I can.
                </p>
                <ContactForm/>
            </section>
        </>
    );
}
