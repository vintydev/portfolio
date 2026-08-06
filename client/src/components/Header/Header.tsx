import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import styles from "./Header.module.css";

export function Header(): ReactElement
{
    const { projects } = useProjects();
    const showProjects = import.meta.env.DEV || projects.length > 0;

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.wordmark}>Vincenzo R.</Link>
                <nav className={styles.nav}>
                    {showProjects && <Link to="/projects">Projects</Link>}
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </header>
    );
}
