import type { ReactElement, ReactNode } from "react";
import styles from "./Button.module.css";

export type tButtonVariant = "primary" | "secondary";

interface IButtonProps
{
    label: string;
    icon?: ReactNode;
    variant?: tButtonVariant;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
}

// Button is a reusable pill-shaped button, styled to match LinkButton but for in-page actions rather than navigation
export function Button({ label, icon, variant = "secondary", onClick, disabled = false, ariaLabel }: IButtonProps): ReactElement
{
    return (
        <button
            type="button"
            className={`${styles.button} ${variant === "primary" ? styles.primary : styles.secondary}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}
