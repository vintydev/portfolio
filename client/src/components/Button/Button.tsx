import type { ReactElement, ReactNode } from "react";
import styles from "./Button.module.css";

export type tButtonVariant = "primary" | "secondary";

interface IButtonProps
{
    label: string;
    icon?: ReactNode;
    variant?: tButtonVariant;
    type?: "button" | "submit";
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}

// Button is the shared pill-shaped button; styles live in this module and are reused by
// LinkButton (an <a> rendering of the same component, for navigation rather than in-page actions)
export function Button({ label, icon, variant = "secondary", type = "button", onClick, disabled = false, ariaLabel, className }: IButtonProps): ReactElement
{
    return (
        <button
            type={type}
            className={`${styles.button} ${variant === "primary" ? styles.primary : styles.secondary} ${className ?? ""}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}
