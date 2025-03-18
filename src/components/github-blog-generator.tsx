import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/cards';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Check, Edit, Eye, Tag, Search, Calendar, ArrowUpDown, Plus, X } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import _ from 'lodash';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog-utils';

const MarkdownBlogApp = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getAllBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [editedPost, setEditedPost] = useState<BlogPost | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  // Extract all unique tags
  useEffect(() => {
    const tags = _.uniq(_.flatMap(posts, post => post.tags));
    setAllTags(tags);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesTag = filterTag ? post.tags.includes(filterTag) : true;
    const matchesSearch = searchTerm 
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  const sortedPosts = _.orderBy(
    filteredPosts, 
    [sortBy], 
    [sortOrder]
  );

  const handleTagClick = (tag) => {
    setFilterTag(prevTag => prevTag === tag ? '' : tag);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleEditPost = () => {
    setEditedPost({...activeBlog});
    setIsEditing(true);
  };

  const handleSavePost = () => {
    setPosts(posts.map(post => 
      post.id === editedPost.id ? editedPost : post
    ));
    setActiveBlog(editedPost);
    setIsEditing(false);
  };

  const handleTagDelete = (tagToDelete) => {
    setEditedPost({
      ...editedPost,
      tags: editedPost.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !editedPost.tags.includes(newTagInput.trim())) {
      setEditedPost({
        ...editedPost,
        tags: [...editedPost.tags, newTagInput.trim()]
      });
      setNewTagInput('');
    }
  };

  const renderMarkdown = (content) => {
    // Very simple markdown renderer for demo purposes
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .replace(/<li>(.*)<\/li>/g, '<ul class="list-disc pl-6 my-2">$&</ul>')
      .replace(/\n\n/g, '<br/><br/>');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading blog posts...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {!activeBlog ? (
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Markdown Blog</CardTitle>
              <CardDescription>
                A simple blog platform powered by Markdown files and GitHub Pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {allTags.map(tag => (
                    <Badge 
                      key={tag}
                      variant={filterTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagClick(tag)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search posts..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('date')}
                  >
                    <Calendar className="h-4 w-4" />
                    Date
                    {sortBy === 'date' && (
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('title')}
                  >
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    Title
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPosts.map(post => (
              <Card 
                key={post.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveBlog(post)}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-gray-600">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveBlog(null);
                setIsEditing(false);
              }}
            >
              Back to Posts
            </Button>
            
            {!isEditing ? (
              <Button onClick={handleEditPost}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
            ) : (
              <Button onClick={handleSavePost}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
          
          {!isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{activeBlog.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(activeBlog.date)}
                  </span>
                  <span>By {activeBlog.author}</span>
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {activeBlog.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(activeBlog.content) }}
                />
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">
                  <Edit className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <Input
                      value={editedPost?.title}
                      onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
                      className="text-xl font-bold"
                      placeholder="Post Title"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="date"
                        value={editedPost?.date}
                        onChange={(e) => setEditedPost({...editedPost, date: e.target.value})}
                        className="w-40"
                      />
                      <Input
                        value={editedPost?.author}
                        onChange={(e) => setEditedPost({...editedPost, author: e.target.value})}
                        placeholder="Author"
                        className="w-48"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex flex-wrap gap-2">
                        {editedPost?.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer"
                              onClick={() => handleTagDelete(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="Add tag"
                          className="w-48"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Input
                      value={editedPost?.excerpt}
                      onChange={(e) => setEditedPost({...editedPost, excerpt: e.target.value})}
                      placeholder="Brief excerpt of your post"
                      className="mt-2"
                    />
                  </CardHeader>
                  
                  <CardContent>
                    <textarea
                      value={editedPost?.content}
                      onChange={(e) => setEditedPost({...editedPost, content: e.target.value})}
                      className="w-full min-h-[500px] p-2 border rounded font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{editedPost?.title}</CardTitle>
                    <CardDescription className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(editedPost?.date)}
                      </span>
                      <span>By {editedPost?.author}</span>
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {editedPost?.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(editedPost?.content) }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownBlogApp;