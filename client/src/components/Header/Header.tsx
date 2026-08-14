import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { LinkButton } from "../LinkButton/LinkButton";
import styles from "./Header.module.css";

export function Header(): ReactElement
{
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.wordmark}>Vincenzo R.</Link>
                <LinkButton
                    href="/cv/Russo_Vincenzo_CV.pdf"
                    label="Download CV"
                    icon={<FiDownload/>}
                    variant="primary"
                    external={true}
                />
            </div>
        </header>
    );
}
