import type { ReactElement } from "react";
import styles from "./Footer.module.css";

export function Footer(): ReactElement
{
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p>
                    &copy; {year} Vincenzo R. &middot;{" "}
                    <a href="https://github.com/vintydev/portfolio" target="_blank" rel="noopener noreferrer">
                        {"How this is built >>>"}
                    </a>
                </p>
                <a href="mailto:contact@vinty.dev">contact@vinty.dev</a>
            </div>
        </footer>
    );
}
