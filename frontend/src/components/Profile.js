import React from 'react';

export default function Profile({ currentUser, posts, onEditClick, onPostDeleted }) {
  const myPosts = posts.filter((p) => p.userId === currentUser.user_id);

  return (
    <div>
      <div className="card">
        <h2>My Profile</h2>
        <p><strong>Username:</strong> {currentUser.user_id}</p>
        <p><strong>Full Name:</strong> {currentUser.name}</p>
        <p><strong>Age:</strong> {currentUser.age}</p>
        <p><strong>Occupation:</strong> {currentUser.occupation}</p>
        <p><strong>City:</strong> {currentUser.city}</p>
      </div>

      <h2>My Blog Posts ({myPosts.length})</h2>
      {myPosts.length === 0 ? (
        <p style={{ color: "#666" }}>You haven't posted any blogs yet.</p>
      ) : (
        myPosts.map((post) => (
          <article className="post" key={post.id}>
            <h3>{post.title}</h3>
            <div className="post-meta">Posted on {post.created}</div>
            <p>{post.content}</p>
            <div className="actions">
              <button className="btn btn-secondary" onClick={() => onEditClick(post)}>Edit</button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  if (!window.confirm("Delete post?")) return;
                  await fetch(`http://localhost:8000/api/posts/${post.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUser.user_id })
                  });
                  onPostDeleted(post.id);
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}