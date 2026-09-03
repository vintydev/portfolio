import type { ReactElement, ReactNode, MouseEvent } from "react";
import type { tButtonVariant } from "../Button/Button";
import styles from "../Button/Button.module.css";

interface ILinkButtonProps
{
    href: string;
    label: string;
    icon?: ReactNode;
    variant?: tButtonVariant;
    external?: boolean;
    download?: string;
    className?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

// LinkButton is Button's <a> rendering, sharing its stylesheet — used for the hero CTAs
// (LinkedIn, GitHub, email, contact) and the header's CV download, where the target is a
// navigation (or download) rather than an in-page action
export function LinkButton({ href, label, icon, variant = "secondary", external = false, download, className, onClick }: ILinkButtonProps): ReactElement
{
    return (
        <a
            className={`${styles.button} ${variant === "primary" ? styles.primary : styles.secondary} ${className ?? ""}`}
            href={href}
            onClick={onClick}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(download ? { download } : {})}
        >
            {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
            <span>{label}</span>
        </a>
    );
}
