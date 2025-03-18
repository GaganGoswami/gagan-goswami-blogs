import { BlogPost } from '@/types/blog';

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('http://localhost:3001/api/blog-posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const posts: BlogPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Error in fetchBlogPosts:', error);
    throw error;
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | undefined> {
  const posts = await fetchBlogPosts();
  return posts.find(post => post.id === id);
}