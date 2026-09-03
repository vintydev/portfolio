import type { ReactElement, ReactNode } from "react";
import styles from "./SkillTag.module.css";

interface ISkillTagProps
{
    label: string;
    icon?: ReactNode;
}

// SkillTag is a single dashed skill pill, shared by ProjectCard (plain) and ExperienceItem
// (with a per-skill icon) so both draw from one definition rather than two near-duplicates
export function SkillTag({ label, icon }: ISkillTagProps): ReactElement
{
    return (
        <li className={styles.tag}>
            {icon}
            <span>{label}</span>
        </li>
    );
}

interface ISkillListProps
{
    children: ReactNode;
}

// SkillList is the flex-wrap <ul> that SkillTag items live in
export function SkillList({ children }: ISkillListProps): ReactElement
{
    return <ul className={styles.list}>{children}</ul>;
}
