import { useState, useEffect, type ReactElement } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { usePageMeta } from "../../hooks/usePageMeta";
import { useContainerSize } from "../../hooks/useContainerSize";
import { useZoom } from "../../hooks/useZoom";
import { usePanZoom } from "../../hooks/usePanZoom";
import { useIsScrolling } from "../../hooks/useIsScrolling";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ZoomControls } from "../../components/ZoomControls/ZoomControls";
import styles from "./CV.module.css";

// Set the workerSrc property for pdfjs to load the PDF worker script for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const CV_PATH = "/cv/Russo_Vincenzo_CV.pdf";
const MAX_READING_WIDTH = 800;

interface IOnLoadSuccess
{
    numPages: number;
}

export function CV(): ReactElement
{
    usePageMeta(
        "CV | Vincenzo R.",
        "View or download Vincenzo R.'s CV."
    );

    const [numPages, setNumPages] = useState<number>(0);
    const [renderedPages, setRenderedPages] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const isReady = numPages > 0 && renderedPages >= numPages;

    const { containerRef, element: viewportElement, width: viewportWidth } = useContainerSize();
    const { zoom, canZoomIn, canZoomOut, zoomIn, zoomOut, zoomBy } = useZoom();
    const isPanning = usePanZoom({ element: viewportElement, zoomBy });
    const isScrolling = useIsScrolling(viewportElement);
    const committedZoom = useDebouncedValue(zoom, 200);

    const readingWidth = Math.min(viewportWidth, MAX_READING_WIDTH);
    const zoomedWidth = readingWidth * committedZoom;
    const liveScale = zoom / committedZoom;

    function HandleLoadSuccess({ numPages }: IOnLoadSuccess): void
    {
        setRenderedPages(0);
        setNumPages(numPages);
    }

    function HandlePageRenderSuccess(): void
    {
        setRenderedPages((prev) => prev + 1);
    }

    useEffect(() =>
    {
        function HandleFullscreenChange(): void
        {
            setIsFullscreen(!!document.fullscreenElement);
        }

        document.addEventListener("fullscreenchange", HandleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", HandleFullscreenChange);
    }, []);

    async function HandleToggleFullscreen(): Promise<void>
    {
        if (!viewportElement)
        {
            return;
        }

        if (document.fullscreenElement)
        {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
        else
        {
            await viewportElement.requestFullscreen();
            setIsFullscreen(true);
        }
    }

    return (
        <section className={styles.cv} aria-labelledby="cv-heading">

            <div
                ref={containerRef}
                className={`${styles.viewport} ${isPanning ? styles.panning : ""}`}
            >
                <Document
                    file={CV_PATH}
                    onLoadSuccess={HandleLoadSuccess}
                    loading={null}
                    error={<p className={styles.status}>Couldn't load the CV — try downloading it instead.</p>}
                >
                    <div
                        className={`${styles.pages} ${isReady ? styles.ready : ""}`}
                        style={{ transform: `scale(${liveScale})`, transformOrigin: "50% 0" }}
                    >
                        {Array.from({ length: numPages }, (_, index) => (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={true}
                                width={zoomedWidth}
                                loading={null}
                                onRenderSuccess={HandlePageRenderSuccess}
                            />
                        ))}
                    </div>
                </Document>

            </div>

            <ZoomControls
                zoom={zoom}
                canZoomIn={canZoomIn}
                canZoomOut={canZoomOut}
                isFullscreen={isFullscreen}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onToggleFullscreen={HandleToggleFullscreen}
                isFaded={isScrolling || isPanning}
            />

        </section>
    );
}
