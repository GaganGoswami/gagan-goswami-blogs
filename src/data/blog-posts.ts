import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Markdown Blogging',
    content: `# Getting Started with Markdown Blogging

## Introduction

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents...`,
    excerpt: 'Learn how to set up a blog using Markdown files and host it on GitHub Pages for free.',
    date: '2025-03-10',
    tags: ['markdown', 'github-pages', 'tutorial'],
    author: 'Jane Doe'
  },
  {
    id: '2',
    title: 'Advanced Markdown Techniques',
    content: `# Advanced Markdown Techniques

## Beyond the Basics

While Markdown is simple to learn...`,
    excerpt: 'Take your technical writing to the next level with advanced Markdown features.',
    date: '2025-03-15',
    tags: ['markdown', 'technical-writing'],
    author: 'John Smith'
  }
];