import React, { useState } from 'react';

export default function EditPostForm({ post, currentUser, onPostUpdated, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.user_id,
          title,
          content
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      onPostUpdated(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Author</label>
          <input type="text" value={post.author} disabled />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            rows="6"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="actions">
          <button type="submit" className="btn">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}