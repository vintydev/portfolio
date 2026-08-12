import type { ReactElement } from "react";
import { useActiveSection } from "../../hooks/useActiveSection";
import styles from "./SectionNav.module.css";

export interface ISectionNavItem
{
    id: string;
    label: string;
}

interface ISectionNavProps
{
    items: ISectionNavItem[];
}

// SectionNav is a fixed right-hand rail of dots, one per page section, for jumping between them
export function SectionNav({ items }: ISectionNavProps): ReactElement
{
    const activeId = useActiveSection(items.map((item) => item.id));

    return (
        <nav className={styles.nav} aria-label="Page sections">
            <ul className={styles.list}>
                <span className={styles.thread} aria-hidden="true"/>
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className={`${styles.item} ${item.id === activeId ? styles.active : ""}`}
                            onClick={(e) =>
                            {
                                e.preventDefault();

                                const el = document.getElementById(item.id);

                                if (el)
                                {
                                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                                    try
                                    {
                                        history.pushState(null, "", `#${item.id}`);
                                    }
                                    catch
                                    {
                                        /* ignore pushState errors */
                                    }
                                }
                            }}
                        >
                            <span className={styles.label}>{item.label}</span>
                            {/* double-stroke wobble, same technique as the LookingBadge's thought-bubble ellipses */}
                            <svg className={styles.dot} viewBox="0 0 24 24" aria-hidden="true">
                                <ellipse className={styles.dotShape} cx="12" cy="12.5" rx="7" ry="6.5" transform="rotate(-8 12 12.5)"/>
                                <ellipse className={styles.dotShape} cx="12.5" cy="11.5" rx="6.5" ry="7" transform="rotate(6 12.5 11.5)"/>
                            </svg>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
