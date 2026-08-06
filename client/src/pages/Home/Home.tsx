import type { ReactElement } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useExperience } from "../../hooks/useExperience";
import { useSiteStatus } from "../../hooks/useSiteStatus";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ExperienceItem } from "../../components/ExperienceItem/ExperienceItem";
import { LookingBadge } from "../../components/LookingBadge/LookingBadge";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import styles from "./Home.module.css";

export function Home(): ReactElement
{
    const { projects, isLoading, error } = useProjects();
    const { experience, isLoading: isExperienceLoading, error: experienceError } = useExperience();
    const isLookingForWork = useSiteStatus();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    return (
        <>
            <section className={styles.hero}>
                {isLookingForWork && <LookingBadge/>}
                <p className={styles.tagline}>Full-stack developer &middot; React/React Native &amp; .NET Core</p>
                <h1 className={styles.heading}>
                    <span className={styles.nameText}>
                        Vincenzo{" "}
                        <em className={styles.surname}>
                            R
                            <span className={styles.dot}>.</span>
                            <span className={styles.tail} aria-hidden="true">
                                <span className={styles.letter}>u</span>
                                <span className={styles.letter}>s</span>
                                <span className={styles.letter}>s</span>
                                <span className={styles.letter}>o</span>
                            </span>
                        </em>
                    </span>
                </h1>
                <p className={styles.intro}>
                    I build mobile and web applications end-to-end, from the database to the user interface. I&rsquo;m currently working on a few personal projects and looking for new opportunities.
                </p>
                <div className={styles.heroCta}>
                    <a className={styles.ctaPrimary} href="#contact">Get in touch</a>
                    <a className={styles.ctaSecondary} href="mailto:contact@vinty.dev">Email me</a>
                </div>
            </section>

            <section className={styles.experience} aria-labelledby="experience-heading">
                <h2 id="experience-heading">Experience Timeline</h2>

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
