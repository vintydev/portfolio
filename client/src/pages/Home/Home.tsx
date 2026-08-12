import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiMessageCircle } from "react-icons/fi";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useProjects } from "../../hooks/useProjects";
import { useExperience } from "../../hooks/useExperience";
import { useSiteStatus } from "../../hooks/useSiteStatus";
import { usePageMeta } from "../../hooks/usePageMeta";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ExperienceItem } from "../../components/ExperienceItem/ExperienceItem";
import { LookingBadge } from "../../components/LookingBadge/LookingBadge";
import { SectionNav } from "../../components/SectionNav/SectionNav";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import type { ISectionNavItem } from "../../components/SectionNav/SectionNav";
import styles from "./Home.module.css";

export function Home(): ReactElement
{
    usePageMeta(
        "Vincenzo R. | Full-Stack Developer",
        "Portfolio of Vincenzo R., a full-stack developer specialising in ASP.NET Core and React."
    );

    const { projects, isLoading, error } = useProjects();
    const { experience, isLoading: isExperienceLoading, error: experienceError } = useExperience();
    const isLookingForWork = useSiteStatus();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    const roleExperience = experience.filter((item) => item.type === "role");
    const educationExperience = experience.filter((item) => item.type === "education");

    const navItems: ISectionNavItem[] = [
        { id: "hero", label: "Intro" },
        { id: "experience", label: "Experience" },
        { id: "education", label: "Education" },
        ...(showProjects ? [{ id: "projects", label: "Projects" }] : []),
        { id: "contact", label: "Contact" }
    ];

    const activeSectionId = useActiveSection(navItems.map((i) => i.id));
    const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>(() => ({ hero: true }));

    useEffect(() =>
    {
        if (!activeSectionId)
        {
            return;
        }

        // guarded against redundant updates below, so this can't cascade into a render loop
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRevealedSections((prev) =>
        {
            if (prev[activeSectionId])
            {
                return prev;
            }

            return { ...prev, [activeSectionId]: true };
        });
    }, [activeSectionId]);

    const [showScrollHint, setShowScrollHint] = useState(true);
    const lastY = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);

    const heroRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const arrowPathRef = useRef<SVGPathElement>(null);
    const [isBadgeHovered, setIsBadgeHovered] = useState(false);
    const [heroSize, setHeroSize] = useState({ width: 0, height: 0 });
    const [arrowPath, setArrowPath] = useState("");
    const [arrowLength, setArrowLength] = useState(0);

    const measureArrowRef = useRef<() => void>(() => {});

    useEffect(() =>
    {
        if (!isLookingForWork)
        {
            return;
        }

        const measure = () =>
        {
            const heroEl = heroRef.current;
            const badgeEl = badgeRef.current;
            const ctaEl = ctaRef.current;

            if (!heroEl || !badgeEl || !ctaEl)
            {
                return;
            }

            // aim at the Contact button specifically (the row's last child) rather than the
            // row's midpoint, so the arrowhead lands right beside it
            const targetEl = (ctaEl.lastElementChild as HTMLElement | null) ?? ctaEl;

            const heroRect = heroEl.getBoundingClientRect();
            const badgeRect = badgeEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            setHeroSize({ width: heroRect.width, height: heroRect.height });

            const startX = badgeRect.left + badgeRect.width * 0.5 - heroRect.left;
            const startY = badgeRect.bottom - heroRect.top - 6;
            const tipX = targetRect.right - heroRect.left + 40;
            const tipY = targetRect.top - 120;

            // single control point pulled right toward the target, so the curve is a gentle swoop rather than a straight line
            const midX = startX + (tipX - startX) * 0.75 + 80;
            const midY = startY + (tipY - startY) * 0.5;

            // arrowhead is drawn as extra segments tacked onto the same path, so the dash
            // animation reveals it right after the curve, like a pen flicking off the line end
            const angle = Math.atan2(tipY - midY, tipX - midX);
            const headLength = 20;
            const leftAngle = angle + Math.PI - 0.5;
            const rightAngle = angle + Math.PI + 0.5;
            const leftX = tipX + headLength * Math.cos(leftAngle);
            const leftY = tipY + headLength * Math.sin(leftAngle);
            const rightX = tipX + headLength * Math.cos(rightAngle);
            const rightY = tipY + headLength * Math.sin(rightAngle);

            setArrowPath(
                `M${startX},${startY} Q${midX},${midY} ${tipX},${tipY} ` +
                `M${leftX},${leftY} L${tipX},${tipY} L${rightX},${rightY}`
            );
        };

        measureArrowRef.current = measure;
        measure();

        window.addEventListener("resize", measure);

        return () => window.removeEventListener("resize", measure);
    }, [isLookingForWork]);

    useEffect(() =>
    {
        if (arrowPathRef.current)
        {
            setArrowLength(arrowPathRef.current.getTotalLength());
        }
    }, [arrowPath]);

    useEffect(() =>
    {
        let ticking = false;

        const onScroll = () =>
        {
            if (ticking)
            {
                return;
            }

            ticking = true;

            requestAnimationFrame(() =>
            {
                const y = window.scrollY || 0;
                const delta = y - lastY.current;

                const heroEl = document.getElementById("hero");
                const heroRect = heroEl?.getBoundingClientRect();
                const heroVisible = !!(heroRect && heroRect.bottom > 0 && heroRect.top < window.innerHeight);

                // Show when near the top of the page
                if (y <= 10)
                {
                    setShowScrollHint(true);
                }
                // Hide if the user scrolls down a bit, to avoid distraction
                else if (delta > 6)
                {
                    setShowScrollHint(false);
                }
                // Show on upward scroll, but only if the hero section is still visible
                else if (delta < -6)
                {
                    setShowScrollHint(heroVisible);
                }

                lastY.current = y;

                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        // initial check
        onScroll();

        return () =>
        {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <>
            <SectionNav items={navItems} />

            <section id="hero" ref={heroRef} className={styles.hero}>
                <svg width="0" height="0" aria-hidden="true" focusable="false" className={styles.filterDefs}/>

                {isLookingForWork && (
                    <LookingBadge
                        ref={badgeRef}
                        onHoverChange={(hovering) =>
                        {
                            // re-measure right before the arrow is revealed rather than relying on the
                            // mount-time snapshot, so it reflects the badge's actual settled position
                            // instead of whatever mid-entrance-animation frame happened to be on screen
                            // when the page first loaded
                            if (hovering)
                            {
                                measureArrowRef.current();
                            }

                            setIsBadgeHovered(hovering);
                        }}
                    />
                )}
                {isLookingForWork && (
                    <svg
                        className={`${styles.arrow} ${isBadgeHovered ? styles.arrowVisible : ""} no-reveal`}
                        viewBox={`0 0 ${heroSize.width} ${heroSize.height}`}
                        aria-hidden="true"
                    >
                        <path
                            ref={arrowPathRef}
                            d={arrowPath}
                            className={styles.arrowPathRough}
                            style={{ strokeDasharray: arrowLength, strokeDashoffset: isBadgeHovered ? 0 : arrowLength }}
                        />
                        <path
                            d={arrowPath}
                            className={styles.arrowPath}
                            style={{ strokeDasharray: arrowLength, strokeDashoffset: isBadgeHovered ? 0 : arrowLength }}
                        />
                    </svg>
                )}
                <p className={styles.tagline}>Junior Full-stack developer &middot; React/React Native &amp; .NET Core</p>
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
                    Ciao! I build mobile and web applications end-to-end, from the database to the user interface (wow, that rhymed). I&rsquo;m currently working on a few personal projects and
                    <span className={styles.accentText}> looking for new commercial opportunities.</span>
                </p>
                <div ref={ctaRef} className={`${styles.heroCta} ${isBadgeHovered ? styles.ctaHighlighted : ""}`}>
                    <LinkButton href="https://linkedin.com/in/vincenzo-fabrizio-russo-20277932b" label="LinkedIn" icon={<FiLinkedin />} external />
                    <LinkButton href="https://github.com/vintydev" label="GitHub" icon={<FiGithub />} external />
                    <LinkButton href="mailto:contact@vinty.dev" label="Email" icon={<FiMail />} />
                    <LinkButton href="#contact" label="Contact" icon={<FiMessageCircle />} variant="primary" />
                </div>
                <a
                    href="#experience"
                    className={`${styles.scrollHint} ${showScrollHint ? "" : styles.scrollHintHidden}`}
                    aria-label="Scroll to experience"
                    onClick={(e) =>
                    {
                        e.preventDefault();

                        const el = document.getElementById("experience");

                        if (el)
                        {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                            try
                            {
                                history.pushState(null, "", "#experience");
                            }
                            catch
                            {
                                /* ignore */
                            }
                        }
                    }}
                >
                    <span className={styles.chev} aria-hidden="true">⌄</span>
                    <span className={styles.hint}>Scroll</span>
                </a>
            </section>

            <section id="experience" className={`${styles.experience} ${revealedSections["experience"] ? styles.revealVisible : styles.reveal}`} aria-labelledby="experience-heading">
                <h2 id="experience-heading">Experience Timeline</h2>

                {isExperienceLoading && <p>Loading experience&hellip;</p>}
                {experienceError && <p role="alert">{experienceError}</p>}

                {!isExperienceLoading && !experienceError && (
                    <div className={styles.timeline}>
                        {roleExperience.map((item) => (
                            <ExperienceItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>

            <section id="education" className={`${styles.experience} ${revealedSections["education"] ? styles.revealVisible : styles.reveal}`} aria-labelledby="education-heading">
                <h2 id="education-heading">Education</h2>

                {!isExperienceLoading && !experienceError && (
                    <div className={styles.timeline}>
                        {educationExperience.map((item) => (
                            <ExperienceItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>

            {showProjects && (
                <section id="projects" className={`${styles.projects} ${revealedSections["projects"] ? styles.revealVisible : styles.reveal}`} aria-labelledby="featured-projects-heading">
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

            <section id="contact" className={`${styles.contact} ${revealedSections["contact"] ? styles.revealVisible : styles.reveal}`} aria-labelledby="contact-heading">
                <h2 id="contact-heading">Get in touch</h2>
                <p className={styles.contactIntro}>
                    Have a project in mind or just want to say hi? Send a message and I&rsquo;ll reply as soon as I can.
                </p>
                <ContactForm />
            </section>
        </>
    );
}
