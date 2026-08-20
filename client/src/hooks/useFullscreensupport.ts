
// Quick hook to determine if the current browser supports fullscreen mode
export function useFullscreenSupport(): boolean
{
    return typeof document !== "undefined" && document.fullscreenEnabled;
}