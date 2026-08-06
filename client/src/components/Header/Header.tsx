import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export function Header(): ReactElement
{
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.wordmark}>Vincenzo R.</Link>
                <nav className={styles.nav}>
                    <Link to="/projects">Projects</Link>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </header>
    );
}
