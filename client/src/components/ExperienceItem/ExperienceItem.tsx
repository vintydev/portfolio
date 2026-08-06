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
            {item.logoUrl ? (
                <img className={styles.logo} src={item.logoUrl} alt="" />
            ) : (
                <span className={styles.marker} aria-hidden="true" />
            )}
            <div className={styles.content}>
                <p className={styles.dateRange}>{dateRange}</p>
                <h3 className={styles.organisation}>{item.organisation}</h3>
                <p className={styles.role}>
                    {item.title}
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
            </div>
        </article>
    );
}
