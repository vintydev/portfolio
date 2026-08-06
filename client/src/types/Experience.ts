export type tExperienceType = "role" | "education";

export interface IExperience
{
    id: number;
    type: tExperienceType;
    organisation: string;
    title: string;
    location: string | null;
    logoUrl: string | null;
    startDate: string;
    endDate: string | null;
    summary: string;
    highlights: string[];
}
