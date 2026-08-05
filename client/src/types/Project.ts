export interface IProject
{
    id: number;
    title: string;
    description: string;
    repoUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    skills: string[];
}
