import express from 'express';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/blog-posts', (req, res) => {
  const blogDataDirectory = path.join(process.cwd(), 'blog-data');
  const fileNames = fs.readdirSync(blogDataDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(blogDataDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title,
      content: matterResult.content,
      excerpt: matterResult.data.excerpt,
      date: matterResult.data.date,
      tags: matterResult.data.tags,
      author: matterResult.data.author,
    };
  });

  res.json(allPostsData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});