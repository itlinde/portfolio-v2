export type ProjectType = 'engineering' | 'design';

export interface Project {
  title: string;
  description?: string;               // big-card only — SmallProjectItem doesn't render this
  tags: string[];
  types: ProjectType[];               // eng or design
  mainProject: boolean;               // main projects = big cards, not-main projects = small card
  date: string;
  link: string;
  image?: { src: string; alt: string }; // big-card only — SmallProjectItem doesn't render this
  tooltipContent: string;
}