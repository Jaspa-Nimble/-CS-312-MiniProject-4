import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// In-memory data store for users and posts
let users = [];

let posts = [
  {
    id: "1",
    userId: "jasper123",
    author: "Jasper",
    title: "Welcome!",
    content: "You can edit or delete this!",
    created: new Date().toLocaleString()
  }
];

// --- AUTHENTICATION ROUTES (Step 4 & Bonus) ---

// Signup
app.post("/api/signup", (req, res) => {
  const { user_id, password, name, age, occupation, city } = req.body;

  if (!user_id || !password || !name) {
    return res.status(400).json({ error: "user_id, password, and name are required." });
  }

  const existingUser = users.find((u) => u.user_id === user_id);
  if (existingUser) {
    return res.status(409).json({ error: "Username/User ID already exists." });
  }

  const newUser = {
    user_id,
    password,
    name,
    age: age || "N/A",
    occupation: occupation || "N/A",
    city: city || "N/A"
  };

  users.push(newUser);
  return res.status(201).json({
    message: "Signup successful",
    user: { user_id: newUser.user_id, name: newUser.name, age: newUser.age, occupation: newUser.occupation, city: newUser.city }
  });
});

// Signin
app.post("/api/signin", (req, res) => {
  const { user_id, password } = req.body;

  const user = users.find((u) => u.user_id === user_id && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid user_id or password." });
  }

  return res.json({
    message: "Signin successful",
    user: { user_id: user.user_id, name: user.name, age: user.age, occupation: user.occupation, city: user.city }
  });
});

// --- BLOG POST ROUTES (Steps 3, 5, 6, 7, 8) ---

// Get all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Create new post
app.post("/api/posts", (req, res) => {
  const { userId, author, title, content } = req.body;

  if (!title || !content || !userId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newPost = {
    id: Date.now().toString(),
    userId,
    author: author || "Anonymous",
    title,
    content,
    created: new Date().toLocaleString()
  };

  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// Update an existing post (Ownership verified)
app.put("/api/posts/:id", (req, res) => {
  const { userId, title, content } = req.body;
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.userId !== userId) {
    return res.status(403).json({ error: "Unauthorized: You can only edit your own posts." });
  }

  post.title = title;
  post.content = content;

  res.json({ message: "Post updated successfully", post });
});

// Delete a post (Ownership verified)
app.delete("/api/posts/:id", (req, res) => {
  const { userId } = req.body;
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.userId !== userId) {
    return res.status(403).json({ error: "Unauthorized: You can only delete your own posts." });
  }

  posts = posts.filter((p) => p.id !== req.params.id);
  res.json({ message: "Post deleted successfully", id: req.params.id });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});