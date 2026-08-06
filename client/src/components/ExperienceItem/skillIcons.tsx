import type { ReactElement } from "react";
import {
    SiTypescript, SiReact, SiNodedotjs, SiFirebase, SiDotnet, SiPostgresql,
    SiFigma, SiKotlin, SiSwift, SiFlutter, SiJson, SiGithubactions, SiGithubcopilot, SiRevenuecat
} from "react-icons/si";
import { FiCode } from "react-icons/fi";

// Keyed by the exact Skill.Name stored in the database — extend this as new skills get attached.
// react-icons renders with fill/stroke: currentColor by default, so these inherit the skill tag's
// own colour rather than each technology's own brand colour. There's no real icon for "C#" or
// "REST API Development" in Simple Icons or Devicons (the latter isn't a product/brand at all) —
// C# is left out to fall back to text-only, "REST API Development" gets a generic code-mark icon.
const skillIcons: Record<string, ReactElement> = {
    "TypeScript": <SiTypescript/>,
    "React": <SiReact/>,
    "React Native": <SiReact/>,
    "Node.js": <SiNodedotjs/>,
    "Firebase": <SiFirebase/>,
    "ASP.NET Core": <SiDotnet/>,
    "PostgreSQL": <SiPostgresql/>,
    "Figma": <SiFigma/>,
    "Kotlin": <SiKotlin/>,
    "Swift": <SiSwift/>,
    "Flutter": <SiFlutter/>,
    "JSON": <SiJson/>,
    "GitHub Actions": <SiGithubactions/>,
    "GitHub Copilot": <SiGithubcopilot/>,
    "RevenueCat": <SiRevenuecat/>,
    "REST API Development": <FiCode/>
};

// Returns null when no icon is mapped for this skill, so callers can render a text-only tag instead
export function getSkillIcon(name: string): ReactElement | null
{
    return skillIcons[name] ?? null;
}
