import React from 'react'
import ReactDOM from 'react-dom/client'
import MarkdownBlogApp from './components/github-blog-generator'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MarkdownBlogApp />
  </React.StrictMode>
)