import type { ReactElement } from "react";
import type { IExperience, IExperienceSkill } from "../../types/Experience";
import { getSkillIcon } from "./skillIcons";
import styles from "./ExperienceItem.module.css";

interface IExperienceItemProps
{
    item: IExperience;
}

function formatMonthYear(date: string): string
{
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function groupSkillsByCategory(skills: IExperienceSkill[]): Record<string, string[]>
{
    return skills.reduce<Record<string, string[]>>((groups, skill) =>
    {
        (groups[skill.category] ??= []).push(skill.name);

        return groups;
    }, {});
}

// ExperienceItem renders a single timeline row: date range, organisation/title, and highlight bullets
export function ExperienceItem({ item }: IExperienceItemProps): ReactElement
{
    const dateRange = `${formatMonthYear(item.startDate)} — ${item.endDate ? formatMonthYear(item.endDate) : "Present"}`;

    return (
        <article className={`${styles.item} ${item.endDate === null ? styles.current : ""}`}>
            <div className={styles.markerSlot}>
                {item.logoUrl ? (
                    <img className={styles.logo} src={item.logoUrl} alt="" />
                ) : (
                    <span className={styles.marker} aria-hidden="true" />
                )}
            </div>
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
                {item.skills.length > 0 && (
                    <div className={styles.skillGroups}>
                        {Object.entries(groupSkillsByCategory(item.skills)).map(([category, names]) => (
                            <div key={category} className={styles.skillGroup}>
                                <span className={styles.skillCategory}>{category}</span>
                                <ul className={styles.skillList}>
                                    {names.map((name) => (
                                        <li key={name} className={styles.skillTag}>
                                            {getSkillIcon(name)}
                                            <span>{name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
