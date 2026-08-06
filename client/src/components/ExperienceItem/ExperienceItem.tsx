import type { ReactElement } from "react";
import type { IExperience } from "../../types/Experience";
import styles from "./ExperienceItem.module.css";

interface IExperienceItemProps
{
    item: IExperience;
}

function formatMonthYear(date: string): string
{
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// ExperienceItem renders a single timeline row: date range, organisation/title, and highlight bullets
export function ExperienceItem({ item }: IExperienceItemProps): ReactElement
{
    const dateRange = `${formatMonthYear(item.startDate)} — ${item.endDate ? formatMonthYear(item.endDate) : "Present"}`;

    return (
        <article className={`${styles.item} ${item.endDate === null ? styles.current : ""}`}>
            <p className={styles.dateRange}>{dateRange}</p>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.meta}>
                {item.organisation}
                {item.location && <> &middot; {item.location}</>}
            </p>
            {item.summary && <p className={styles.summary}>{item.summary}</p>}
            {item.highlights.length > 0 && (
                <ul className={styles.highlights}>
                    {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                    ))}
                </ul>
            )}
        </article>
    );
}
