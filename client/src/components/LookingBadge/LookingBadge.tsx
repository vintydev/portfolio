import type { ReactElement, Ref } from "react";
import { forwardRef } from "react";
import styles from "./LookingBadge.module.css";

interface ILookingBadgeProps
{
    onHoverChange?: (hovering: boolean) => void;
}

// LookingBadge is a playful, hand-drawn thought bubble announcing open-to-work status.
// Hovering it drives a sketched arrow + outline in Home.tsx pointing at the CTA buttons,
// so it reports its own hover state up via onHoverChange and exposes its root node via ref
// for the arrow's start-point measurement
export const LookingBadge = forwardRef(function LookingBadge({ onHoverChange }: ILookingBadgeProps, ref: Ref<HTMLSpanElement>): ReactElement
{
    return (
        <span
            ref={ref}
            className={`${styles.badge} no-reveal`}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
        >
            <svg className={styles.bubble} viewBox="0 0 260 160" fill="none" aria-hidden="true">
                <g className={styles.burst} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="226" y1="80" x2="250" y2="78" />
                    <line x1="213" y1="103" x2="237" y2="110" />
                    <line x1="178" y1="120" x2="195" y2="133" />
                    <line x1="130" y1="126" x2="130" y2="139" />
                    <line x1="82" y1="120" x2="65" y2="133" />
                    <line x1="47" y1="103" x2="23" y2="110" />
                    <line x1="34" y1="80" x2="10" y2="82" />
                    <line x1="47" y1="57" x2="23" y2="51" />
                    <line x1="82" y1="41" x2="65" y2="26" />
                    <line x1="130" y1="34" x2="130" y2="21" />
                    <line x1="178" y1="41" x2="196" y2="26" />
                    <line x1="213" y1="57" x2="237" y2="51" />
                </g>
                <ellipse cx="128" cy="79" rx="80" ry="38" stroke="currentColor" strokeWidth="2.5" transform="rotate(-3 128 79)" />
                <ellipse cx="132" cy="81" rx="78" ry="39" stroke="currentColor" strokeWidth="2.5" transform="rotate(2 132 81)" />
            </svg>
            <span className={styles.text}>Currently looking!</span>
        </span>
    );
});
