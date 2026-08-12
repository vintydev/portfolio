import { useEffect } from "react";

// usePageMeta sets the document title and meta description for the current route
// title should be the full, final document title (eg. "Projects | Vincenzo R.")
export function usePageMeta(title: string, description: string): void
{
    useEffect(() =>
    {
        document.title = title;

        const descriptionTag = document.querySelector("meta[name=\"description\"]");

        if (descriptionTag)
        {
            descriptionTag.setAttribute("content", description);
        }
    }, [title, description]);
}
