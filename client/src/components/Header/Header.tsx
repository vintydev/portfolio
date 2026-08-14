import type { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiDownload, FiFileText } from "react-icons/fi";
import { LinkButton } from "../LinkButton/LinkButton";
import styles from "./Header.module.css";

export function Header(): ReactElement
{

    const location = useLocation();
    const currentRoute: string = location.pathname;
    const isCVRoute: boolean = currentRoute === "/cv";
    const buttonLabel: string = isCVRoute ? "Download CV" : "View CV";

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.wordmark}>Vincenzo R.</Link>
                <LinkButton
                    href="/cv"
                    label={buttonLabel}
                    icon={isCVRoute ? <FiDownload/> : <FiFileText/>}
                    variant="primary"
                    download={currentRoute === "/cv" ? "Russo_Vincenzo_CV.pdf" : undefined}
                />
            </div>
        </header>
    );
}
