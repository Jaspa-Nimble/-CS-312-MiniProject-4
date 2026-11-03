import React, { useState, useEffect } from 'react';
import './App.css';
import { SignIn, SignUp } from './components/Auth';
import BlogPostForm from './components/BlogPostForm';
import PostList from './components/PostList';
import EditPostForm from './components/EditPostForm';
import Profile from './components/Profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('signin'); // 'signin' or 'signup'
  const [currentTab, setCurrentTab] = useState('home'); // 'home' or 'profile'
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts and verify connection
  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched posts successfully:", data);
        setPosts(data);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  // Handlers for dynamic list updates
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    setEditingPost(null);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(posts.filter((p) => p.id !== deletedId));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
    setEditingPost(null);
  };

  return (
    <div className="container">
      <header className="nav-bar">
        <h1>Blog</h1>
        {currentUser && (
          <div className="actions" style={{ marginTop: 0 }}>
            <button
              className={`btn ${currentTab === 'home' ? '' : 'btn-secondary'}`}
              onClick={() => { setEditingPost(null); setCurrentTab('home'); }}
            >
              Home
            </button>
            <button
              className={`btn ${currentTab === 'profile' ? '' : 'btn-secondary'}`}
              onClick={() => { setEditingPost(null); setCurrentTab('profile'); }}
            >
              My Profile
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout ({currentUser.name})
            </button>
          </div>
        )}
      </header>

      {/* If not logged in, show Auth screens */}
      {!currentUser ? (
        authView === 'signin' ? (
          <SignIn
            onLoginSuccess={(user) => setCurrentUser(user)}
            switchToSignup={() => setAuthView('signup')}
          />
        ) : (
          <SignUp
            onLoginSuccess={(user) => setCurrentUser(user)}
            switchToSignin={() => setAuthView('signin')}
          />
        )
      ) : (
        /* If logged in, show requested screen */
        <>
          {editingPost ? (
            <EditPostForm
              post={editingPost}
              currentUser={currentUser}
              onPostUpdated={handlePostUpdated}
              onCancel={() => setEditingPost(null)}
            />
          ) : currentTab === 'home' ? (
            <>
              <BlogPostForm currentUser={currentUser} onPostCreated={handlePostCreated} />
              <PostList
                posts={posts}
                currentUser={currentUser}
                onEditClick={(post) => setEditingPost(post)}
                onPostDeleted={handlePostDeleted}
              />
            </>
          ) : (
            <Profile
              currentUser={currentUser}
              posts={posts}
              onEditClick={(post) => setEditingPost(post)}
              onPostDeleted={handlePostDeleted}
            />
          )}
        </>
      )}
    </div>
  );
}