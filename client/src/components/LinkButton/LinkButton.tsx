import type { ReactElement, ReactNode, MouseEvent } from "react";
import styles from "./LinkButton.module.css";

export type tLinkButtonVariant = "primary" | "secondary";

interface ILinkButtonProps
{
    href: string;
    label: string;
    icon?: ReactNode;
    variant?: tLinkButtonVariant;
    external?: boolean;
    download?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

// LinkButton is a reusable pill-shaped link/button, used for the hero CTAs (LinkedIn, GitHub, email, contact)
// and the header's CV download
export function LinkButton({ href, label, icon, variant = "secondary", external = false, download, onClick }: ILinkButtonProps): ReactElement
{
    return (
        <a
            className={`${styles.button} ${variant === "primary" ? styles.primary : styles.secondary}`}
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
