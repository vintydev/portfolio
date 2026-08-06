import type { ReactElement } from "react";
import styles from "./Footer.module.css";

export function Footer(): ReactElement
{
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p>&copy; {year} Vincenzo R.</p>
                <a href="mailto:contact@vinty.dev">contact@vinty.dev</a>
            </div>
        </footer>
    );
}
