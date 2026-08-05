import type { ReactElement } from "react";
import styles from "./Footer.module.css";

export function Footer(): ReactElement
{
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p>&copy; {year} Vincenzo R.</p>
                <a href="mailto:vinnyr1999@googlemail.com">vinnyr1999@googlemail.com</a>
            </div>
        </footer>
    );
}
