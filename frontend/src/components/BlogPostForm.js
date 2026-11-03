import React, { useState } from 'react';

export default function BlogPostForm({ currentUser, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.user_id,
          author: currentUser.name,
          title,
          content
        })
      });

      if (!response.ok) throw new Error("Failed to create post");

      const createdPost = await response.json();
      onPostCreated(createdPost);
      setTitle('');
      setContent('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input type="text" value={currentUser.name} disabled />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            rows="4"
            required
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Publish</button>
      </form>
    </div>
  );
}