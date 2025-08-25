const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/discussion_board', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

app.get('/', async (req, res) => {
    const Post = require('./models/Post');
    let posts = [];
    try {
        posts = await Post.find();
    } catch (err) {
        // Ignore errors for now
    }

    const discussionOptions = posts.map(
        post => `<option value="${post._id}">${post.title}</option>`
    ).join('');

    const discussionList = posts.map(
        post => `
        <li class="discussion-item">
            <div class="discussion-box">
                <strong class="discussion-title">${post.title}</strong>
                <p class="discussion-content">${post.content}</p>
                <button class="view-btn" onclick="window.location.href='/discussion/${post._id}'">View</button>
                <ul class="comment-list">
                    ${(post.comments || []).map(comment =>
                        `<li class="comment-item">${comment.text}</li>`
                    ).join('')}
                </ul>
            </div>
        </li>
        `
    ).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discussion Board</title>
            <style>
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    margin: 0;
                    background: #f4f6fb;
                    color: #222;
                }
                .container {
                    max-width: 800px;
                    margin: 40px auto;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                    padding: 32px 40px;
                }
                h1 {
                    color: #3a7bd5;
                    margin-bottom: 24px;
                    text-align: center;
                }
                h2 {
                    margin-top: 32px;
                    color: #3a7bd5;
                }
                form {
                    margin-bottom: 32px;
                    background: #eaf1fb;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.05);
                }
                label {
                    display: block;
                    margin-top: 12px;
                    font-weight: 500;
                }
                input, textarea, select {
                    width: 100%;
                    padding: 10px 12px;
                    margin-top: 6px;
                    border: 1px solid #bcd0ee;
                    border-radius: 8px;
                    font-size: 1rem;
                    background: #f8fbff;
                    transition: border-color 0.2s;
                }
                input:focus, textarea:focus, select:focus {
                    border-color: #3a7bd5;
                    outline: none;
                }
                button {
                    margin-top: 16px;
                    padding: 10px 24px;
                    background: linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.12);
                    transition: background 0.2s;
                }
                button:hover {
                    background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
                }
                ul {
                    margin-top: 24px;
                    padding-left: 0;
                }
                .discussion-item {
                    list-style: none;
                    margin-bottom: 32px;
                }
                .discussion-box {
                    background: #f8fbff;
                    border-radius: 12px;
                    padding: 20px 24px;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.07);
                    border-left: 6px solid #3a7bd5;
                }
                .discussion-title {
                    font-size: 1.2rem;
                    color: #3a7bd5;
                    font-weight: 700;
                }
                .discussion-content {
                    margin: 12px 0 8px 0;
                    color: #222;
                }
                .view-btn {
                    background: #fff;
                    color: #3a7bd5;
                    border: 2px solid #3a7bd5;
                    border-radius: 8px;
                    padding: 6px 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    transition: background 0.2s, color 0.2s;
                }
                .view-btn:hover {
                    background: #3a7bd5;
                    color: #fff;
                }
                .comment-list {
                    margin-top: 12px;
                    margin-left: 0;
                    padding-left: 0;
                }
                .comment-item {
                    background: #eaf1fb;
                    border-radius: 8px;
                    padding: 8px 12px;
                    margin-bottom: 6px;
                    color: #444;
                    list-style: none;
                    box-shadow: 0 1px 4px rgba(58,123,213,0.04);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Discussion Board</h1>
                
                <h2>Start a New Discussion</h2>
                <form id="new-discussion-form">
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" required>
                    
                    <label for="content">Content:</label>
                    <textarea id="content" name="content" required rows="3"></textarea>
                    
                    <button type="submit">Create Discussion</button>
                </form>
                
                <h2>Post a Comment</h2>
                <form id="comment-form">
                    <label for="discussion">Select Discussion:</label>
                    <select id="discussion" name="discussion" required>
                        ${discussionOptions}
                    </select>
                    
                    <label for="comment">Comment:</label>
                    <textarea id="comment" name="comment" required rows="2"></textarea>
                    
                    <button type="submit">Post Comment</button>
                </form>
                
                <h2>All Discussions</h2>
                <ul>
                    ${discussionList}
                </ul>
            </div>
            <script>
                document.getElementById('new-discussion-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const title = document.getElementById('title').value;
                    const content = document.getElementById('content').value;
                    const res = await fetch('/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, content })
                    });
                    if (res.ok) {
                        alert('Discussion created!');
                        location.reload();
                    } else {
                        alert('Error creating discussion');
                    }
                });

                document.getElementById('comment-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const discussionId = document.getElementById('discussion').value;
                    const comment = document.getElementById('comment').value;
                    const res = await fetch('/posts/' + discussionId + '/comments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ comment })
                    });
                    if (res.ok) {
                        alert('Comment posted!');
                        location.reload();
                    } else {
                        alert('Error posting comment');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Show a single discussion with comments and comment form
app.get('/discussion/:id', async (req, res) => {
    const Post = require('./models/Post');
    let post;
    try {
        post = await Post.findById(req.params.id);
    } catch (err) {
        return res.status(404).send('Discussion not found');
    }
    if (!post) {
        return res.status(404).send('Discussion not found');
    }

    const commentsHtml = (post.comments || []).map(c =>
        `<li class="comment-item">${c.text}</li>`
    ).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${post.title} - Discussion Board</title>
            <style>
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    margin: 0;
                    background: #f4f6fb;
                    color: #222;
                }
                .container {
                    max-width: 700px;
                    margin: 40px auto;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                    padding: 32px 40px;
                }
                h1 {
                    color: #3a7bd5;
                    margin-bottom: 16px;
                }
                h2 {
                    margin-top: 32px;
                    color: #3a7bd5;
                }
                .discussion-box {
                    background: #f8fbff;
                    border-radius: 12px;
                    padding: 20px 24px;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.07);
                    border-left: 6px solid #3a7bd5;
                    margin-bottom: 24px;
                }
                .discussion-title {
                    font-size: 1.2rem;
                    color: #3a7bd5;
                    font-weight: 700;
                }
                .discussion-content {
                    margin: 12px 0 8px 0;
                    color: #222;
                }
                a {
                    color: #3a7bd5;
                    text-decoration: none;
                    font-weight: 500;
                    margin-bottom: 24px;
                    display: inline-block;
                }
                form {
                    margin-bottom: 32px;
                    background: #eaf1fb;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.05);
                }
                label {
                    display: block;
                    margin-top: 12px;
                    font-weight: 500;
                }
                input, textarea {
                    width: 100%;
                    padding: 10px 12px;
                    margin-top: 6px;
                    border: 1px solid #bcd0ee;
                    border-radius: 8px;
                    font-size: 1rem;
                    background: #f8fbff;
                    transition: border-color 0.2s;
                }
                input:focus, textarea:focus {
                    border-color: #3a7bd5;
                    outline: none;
                }
                button {
                    margin-top: 16px;
                    padding: 10px 24px;
                    background: linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(58,123,213,0.12);
                    transition: background 0.2s;
                }
                button:hover {
                    background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
                }
                .comment-list {
                    margin-top: 12px;
                    margin-left: 0;
                    padding-left: 0;
                }
                .comment-item {
                    background: #eaf1fb;
                    border-radius: 8px;
                    padding: 8px 12px;
                    margin-bottom: 6px;
                    color: #444;
                    list-style: none;
                    box-shadow: 0 1px 4px rgba(58,123,213,0.04);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="discussion-box">
                    <h1 class="discussion-title">${post.title}</h1>
                    <p class="discussion-content">${post.content}</p>
                </div>
                <a href="/">&#8592; Back to all discussions</a>
                <h2>Comments</h2>
                <ul class="comment-list">
                    ${commentsHtml}
                </ul>
                <h2>Post a Comment</h2>
                <form id="comment-form">
                    <label for="comment">Comment:</label>
                    <textarea id="comment" name="comment" required rows="2"></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
            <script>
                document.getElementById('comment-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const comment = document.getElementById('comment').value;
                    const res = await fetch('/posts/${post._id}/comments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ comment })
                    });
                    if (res.ok) {
                        alert('Comment posted!');
                        location.reload();
                    } else {
                        alert('Error posting comment');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

const Post = require('./models/Post');

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new post
app.post('/posts', async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a comment to a post
app.post('/posts/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        post.comments.push({ text: req.body.comment });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
