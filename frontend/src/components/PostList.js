import React from 'react';

export default function PostList({ posts, currentUser, onEditClick, onPostDeleted }) {
  const handleDelete = async (postId) => {
    if (!window.confirm("Delete post?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.user_id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");

      onPostDeleted(postId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.length === 0 ? (
        <p style={{ color: "#666" }}>No posts yet.</p>
      ) : (
        posts.map((post) => {
          const isOwner = currentUser && currentUser.user_id === post.userId;
          return (
            <article className="post" key={post.id}>
              <h3>{post.title}</h3>
              <div className="post-meta">By {post.author} • {post.created}</div>
              <p>{post.content}</p>

              {isOwner && (
                <div className="actions">
                  <button className="btn btn-secondary" onClick={() => onEditClick(post)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}