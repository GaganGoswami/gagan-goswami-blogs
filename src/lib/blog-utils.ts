

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  author: string;
}

export const BLOG_DATA: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Markdown Blogging',
    content: `# Getting Started with Markdown Blogging...`,
    excerpt: 'Learn how to set up a blog using Markdown files and host it on GitHub Pages for free.',
    date: '2025-03-10',
    tags: ['markdown', 'github-pages', 'tutorial'],
    author: 'Gagan Goswami'
  },
  {
    id: '2',
    title: 'Advanced Markdown Techniques',
    content: `# Advanced Markdown Techniques...`,
    excerpt: 'Take your technical writing to the next level with advanced Markdown features.',
    date: '2025-03-15',
    tags: ['markdown', 'technical-writing'],
    author: 'Gagan Goswami'
  }
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_DATA;
}