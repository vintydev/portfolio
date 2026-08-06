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
                            <span className={styles.dot} aria-hidden="true"/>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
