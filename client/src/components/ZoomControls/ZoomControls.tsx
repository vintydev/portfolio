import type { ReactElement, ReactNode } from "react";
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

interface IZoomButtonProps
{
    onClick: () => void;
    ariaLabel: string;
    disabled?: boolean;
    children: ReactNode;
}

// ZoomButton is the small icon-only control shared by the three buttons below (zoom out,
// zoom in, fullscreen toggle)
function ZoomButton({ onClick, ariaLabel, disabled = false, children }: IZoomButtonProps): ReactElement
{
    return (
        <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
            {children}
        </button>
    );
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
            <ZoomButton onClick={onZoomOut} disabled={!canZoomOut} ariaLabel="Zoom out">
                <FiZoomOut />
            </ZoomButton>
            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <ZoomButton onClick={onZoomIn} disabled={!canZoomIn} ariaLabel="Zoom in">
                <FiZoomIn />
            </ZoomButton>

            {isFullscreenSupported && (
                <>
                    <span className={styles.divider} aria-hidden="true" />
                    <ZoomButton onClick={onToggleFullscreen} ariaLabel={isFullscreen ? "Exit fullscreen" : "View fullscreen"}>
                        {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                    </ZoomButton>
                </>
            )}
        </div>
    );
}
