export type Category =
  | 'Space'
  | 'Satellite'
  | 'Racing'
  | 'Aero'
  | 'Robotics'
  | 'Physics'
  | 'Mathematics'
  | 'Engineering';
export interface Project {
  title: string;
  slug: string;
  team: string;
  members: string[];
  institution: string;
  category: Category;
  description: string;
  image: string;
  featured: boolean;
  sample?: boolean;
  problem: string;
  solution: string;
  technologies: string[];
  outcomes: string;
}
export interface ExpoTheme {
  title: string;
  category: Category;
  description: string;
  color: string;
}
export interface Update {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string[];
  category: string;
}
