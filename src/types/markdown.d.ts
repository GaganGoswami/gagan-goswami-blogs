declare module '*.md' {
  const content: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    tags: string[];
    author: string;
  };
  export default content;
}