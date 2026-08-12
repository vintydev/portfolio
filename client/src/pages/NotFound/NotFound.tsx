import type { ReactElement } from "react";
import { usePageMeta } from "../../hooks/usePageMeta";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import styles from "./NotFound.module.css";

export function NotFound(): ReactElement
{
    usePageMeta("Page not found | Vincenzo R.", "The page you're looking for doesn't exist or has moved.");

    return (
        <section className={styles.notFound} aria-labelledby="not-found-heading">
            <p className={styles.code}>404</p>
            <h1 id="not-found-heading">Page not found</h1>
            <p className={styles.message}>The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
            <LinkButton href="/" label="Back to home" variant="primary" />
        </section>
    );
}
