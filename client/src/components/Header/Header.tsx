import type { ReactElement, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiDownload, FiFileText } from "react-icons/fi";
import { LinkButton } from "../LinkButton/LinkButton";
import styles from "./Header.module.css";
import { useIsMobile } from "../../hooks/useIsMobile";

const CV_FILENAME = "Russo_Vincenzo_CV.pdf";

export function Header(): ReactElement
{
    const isMobile = useIsMobile();

    // Determine route location and appropriate button label
    // and href for the CV link/button
    const location = useLocation();
    const currentRoute: string = location.pathname;
    const isCVRoute: boolean = currentRoute === "/cv";
    const shouldDownload: boolean = isCVRoute;
    const buttonLabel: string = shouldDownload ? "Download CV" : "View CV";
    const buttonHref: string = shouldDownload ? "/cv/Russo_Vincenzo_CV.pdf" : "/cv";

    // Function to prompt the user to share the CV file if the device supports it, otherwise fallback to download
    async function HandleShareDownload(event: MouseEvent<HTMLAnchorElement>): Promise<void>
    {

        // Only attempt to share the file on mobile devices, otherwise fallback to download
        if (!isMobile) return undefined;

        // Check if the device supports the Web Share API and can share files
        const canShareFiles = typeof navigator.share === "function"
            && typeof navigator.canShare === "function";

        if (!shouldDownload || !canShareFiles)
        {
            return undefined;
        }

        // Prevent the default link behavior to avoid navigating away from the page
        event.preventDefault();

        // Fetch the CV file as a blob and create a File object for sharing
        const response = await fetch(buttonHref);
        const blob = await response.blob();
        const file = new File([blob], CV_FILENAME, { type: "application/pdf" });

        // Check if the device can share files, if not fallback to download
        if (!navigator.canShare({ files: [file] }))
        {
            window.location.href = buttonHref;
            return undefined;
        }

        // Attempt to share the file using the Web Share API, if it fails (e.g., user cancels), 
        // fallback to download
        try
        {
            await navigator.share({ files: [file], title: "Vincenzo Russo — CV" });
        }
        catch
        {
            // Silently catch any errors (e.g., user cancels the share) 
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.wordmark}>Vincenzo R.</Link>
                <LinkButton
                    href={buttonHref}
                    label={buttonLabel}
                    icon={shouldDownload ? <FiDownload /> : <FiFileText />}
                    variant="primary"
                    download={shouldDownload ? CV_FILENAME : undefined}
                    onClick={shouldDownload ? HandleShareDownload : undefined}
                />
            </div>
        </header>
    );
}
