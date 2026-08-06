import type { ReactElement } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useExperience } from "../../hooks/useExperience";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ExperienceItem } from "../../components/ExperienceItem/ExperienceItem";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import styles from "./Home.module.css";

export function Home(): ReactElement
{
    const { projects, isLoading, error } = useProjects();
    const { experience, isLoading: isExperienceLoading, error: experienceError } = useExperience();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    return (
        <>
            <section className={styles.hero}>
                <p className={styles.tagline}>Full-stack developer &middot; .NET &amp; React</p>
                <h1 className={styles.heading}>Vincenzo <em>R.</em></h1>
                <p className={styles.intro}>
                    I build web products end to end &mdash; from ASP.NET Core APIs to React frontends.
                </p>
                <div className={styles.heroCta}>
                    <a className={styles.ctaPrimary} href="#contact">Get in touch</a>
                    <a className={styles.ctaSecondary} href="mailto:contact@vinty.dev">Email me</a>
                </div>
            </section>

            <section className={styles.experience} aria-labelledby="experience-heading">
                <h2 id="experience-heading">Experience</h2>

                {isExperienceLoading && <p>Loading experience&hellip;</p>}
                {experienceError && <p role="alert">{experienceError}</p>}

                {!isExperienceLoading && !experienceError && (
                    <div className={styles.timeline}>
                        {experience.map((item) => (
                            <ExperienceItem key={item.id} item={item}/>
                        ))}
                    </div>
                )}
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
