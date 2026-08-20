import type { ReactElement } from "react";
import { FiZoomIn, FiZoomOut, FiMaximize, FiMinimize } from "react-icons/fi";
import styles from "./ZoomControls.module.css";

interface IZoomControlsProps
{
    zoom: number;
    canZoomIn: boolean;
    canZoomOut: boolean;
    isFullscreen: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleFullscreen: () => void;
    isFaded: boolean;
    isFullscreenSupported: boolean;
}

export function ZoomControls(props: IZoomControlsProps): ReactElement
{
    const {
        zoom,
        canZoomIn,
        canZoomOut,
        isFullscreen,
        onZoomIn,
        onZoomOut,
        onToggleFullscreen,
        isFaded,
        isFullscreenSupported
    } = props;

    return (
        <div className={`${styles.zoomControls} ${isFaded ? styles.faded : ""}`}>
            <button
                type="button"
                onClick={onZoomOut}
                disabled={!canZoomOut}
                aria-label="Zoom out"
            >
                <FiZoomOut />
            </button>
            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <button
                type="button"
                onClick={onZoomIn}
                disabled={!canZoomIn}
                aria-label="Zoom in"
            >
                <FiZoomIn />
            </button>

            {isFullscreenSupported && (
                <>
                <span className={styles.divider} aria-hidden="true" />
                    <button
                        type="button"
                        onClick={onToggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                    >
                        {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                    </button>
                </>
            )}
        </div>
    );
}
