import type { ReactElement } from "react";
import {
    SiTypescript, SiReact, SiNodedotjs, SiFirebase, SiDotnet, SiPostgresql,
    SiFigma, SiKotlin, SiSwift, SiFlutter, SiJson, SiGithubactions, SiGithubcopilot, SiRevenuecat,
    SiPython, SiScala, SiExpress, SiDocker, SiKubernetes, SiJenkins, SiAnsible, SiGit,
    SiJunit5, SiBurpsuite, SiOwasp, SiSonarqubeserver
} from "react-icons/si";
import { FiCode, FiCloud } from "react-icons/fi";


// Keyed by skill name, returns a ReactElement for the icon to display for that skill
const skillIcons: Record<string, ReactElement> = {
    "TypeScript": <SiTypescript/>,
    "React": <SiReact/>,
    "React Native": <SiReact/>,
    "Node.js": <SiNodedotjs/>,
    "Firebase": <SiFirebase/>,
    "ASP.NET Core": <SiDotnet/>,
    ".NET Core": <SiDotnet/>,
    "PostgreSQL": <SiPostgresql/>,
    "Figma": <SiFigma/>,
    "Kotlin": <SiKotlin/>,
    "Swift": <SiSwift/>,
    "Flutter": <SiFlutter/>,
    "JSON": <SiJson/>,
    "GitHub Actions": <SiGithubactions/>,
    "GitHub Copilot": <SiGithubcopilot/>,
    "RevenueCat": <SiRevenuecat/>,
    "REST API Development": <FiCode/>,
    "Python": <SiPython/>,
    "Scala": <SiScala/>,
    "Express": <SiExpress/>,
    "Docker": <SiDocker/>,
    "Kubernetes": <SiKubernetes/>,
    "Jenkins": <SiJenkins/>,
    "Ansible": <SiAnsible/>,
    "Git": <SiGit/>,
    "JUnit": <SiJunit5/>,
    "Burp Suite": <SiBurpsuite/>,
    "OWASP ZAP": <SiOwasp/>,
    "SonarQube": <SiSonarqubeserver/>,
    "AWS": <FiCloud/>
};

// Returns null when no icon is mapped for this skill, so callers can render a text-only tag instead
export function getSkillIcon(name: string): ReactElement | null
{
    return skillIcons[name] ?? <FiCode/>;
}
