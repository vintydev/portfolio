
// A quite nod to how this website was made, kudos if you found it!
export function logConsoleBanner(): void
{
    // Gather the shared CSS variables for accent colours
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--colour-accent").trim() || "#006900";
    const muted = styles.getPropertyValue("--colour-muted").trim() || "#5f6560";

    console.log(
        "%c👋 hey, curious dev.",
        `font: bold 16px monospace; color: ${accent};`
    );
    console.log(
        "%cThis site's React 19 + TypeScript + Vite on the front end, an ASP.NET Core (.NET 10) API, " +
        "and a queue-triggered Azure Function for the contact form — decoupled so a slow SMTP handshake " +
        "can't make you wait on a request.\n\nFull write-up can be seen at: https://github.com/vintydev/portfolio",
        `font: 13px monospace; color: ${muted};`
    );
}
