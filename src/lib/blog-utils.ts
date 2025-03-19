import { BlogPost } from '@/types/blog';
import { fetchBlogPosts } from './blog-service';

export type { BlogPost };

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await fetchBlogPosts();
    return posts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const posts = await getAllBlogPosts();
    return posts.find(post => post.id === id);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return undefined;
  }
}