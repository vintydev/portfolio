import type { ReactElement } from "react";
import { FiDownload } from "react-icons/fi";
import { usePageMeta } from "../../hooks/usePageMeta";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import styles from "./CV.module.css";

const CV_PATH = "/cv/Russo_Vincenzo_CV.pdf";

export function CV(): ReactElement
{
    usePageMeta(
        "CV | Vincenzo R.",
        "View or download Vincenzo R.'s CV."
    );

    return (
        <section className={styles.cv} aria-labelledby="cv-heading">

            <iframe
                src={CV_PATH}
                title="Vincenzo R. CV"
                className={styles.preview}
            />
        </section>
    );
}
