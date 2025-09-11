// Escape HTML utility
function escapeHtml(text) {
    return typeof text === 'string' ? text.replace(/[&<>"]'/g, function (match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return escape[match];
    }) : text;
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// Serve static files from public directory
app.use(express.static('public'));
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
        const User = require('./models/User');
        let posts = [];
        try {
                posts = await Post.find();
        } catch (err) {
                // Ignore errors for now
        }

            // Helper to get username from userId
            async function getUsername(userId) {
                if (!userId) return 'UNKNOWN';
                try {
                    const user = await User.findById(userId);
                    return user ? user.username : 'UNKNOWN';
                } catch {
                    return 'UNKNOWN';
                }
            }

            // Build discussion list with usernames
            async function buildDiscussionList() {
                let html = '';
                for (const post of posts) {
                const postUser = await getUsername(post.userId);
                const postUserId = post.userId ? post.userId.toString() : 'UNKNOWN';
                let commentsHtml = '';
                for (const comment of post.comments || []) {
                    const commentUser = await getUsername(comment.userId);
                    const commentUserId = comment.userId ? comment.userId.toString() : 'UNKNOWN';
                    commentsHtml += `<li class="comment-item">${escapeHtml(comment.text)} <em>by ${escapeHtml(commentUser)} (${escapeHtml(commentUserId)})</em></li>`;
                }
                html += `<li class="discussion-item">
                    <div class="discussion-box">
                        <strong class="discussion-title">${escapeHtml(post.title)}</strong>
                        <p class="discussion-content">${escapeHtml(post.content)}</p>
                        <p><em>Posted by: ${escapeHtml(postUser)} (${escapeHtml(postUserId)})</em></p>
                        <button class="view-btn" onclick="window.location.href='/discussion/${post._id}'">View</button>
                        <ul class="comment-list">
                            ${commentsHtml}
                        </ul>
                    </div>
                </li>`;
                }
                return html;
            }

            const discussionOptions = posts.map(
                    post => `<option value="${post._id}">${escapeHtml(post.title)}</option>`
            ).join('');

            const discussionList = await buildDiscussionList();

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discussion Board</title>
        <link rel="stylesheet" href="/discussion-board.css">
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
                alert("DEBUG: Script loaded and running (main page)");
                // Escape JS string for safe alert display
        /*        function escapeJsString(str) {
                                    return String(str)
                                        .replace(/\\/g, "\\\\")      // Escape backslash
                                        .replace(/'/g, "\\'")            // Escape single quote (no backslash in regex)
                                        .replace(/\"/g, '\\\"')          // Escape double quote
                                        .replace(/\n/g, "\\n")         // Escape newline
                                        .replace(/\r/g, "\\r")         // Escape carriage return
                                        .replace(/\t/g, "\\t")         // Escape tab
                                        .replace(/\u2028/g, "\\u2028") // Escape line separator
                                        .replace(/\u2029/g, "\\u2029"); // Escape paragraph separator
                } */
function escapeJsString(str) {
                                    return String(str)
                                        .replace(/'/g, "\\'")            // Escape single quote (no backslash in regex)
                                        .replace(/\"/g, '\\\"')          // Escape double quote
                                        .replace(/\t/g, "\\t")         // Escape tab
                                        .replace(/\u2028/g, "\\u2028") // Escape line separator
                                        .replace(/\u2029/g, "\\u2029"); // Escape paragraph separator
    }
                // Decode JWT to get userId
                function getUserIdFromToken() {
                  const token = window.localStorage.getItem('authToken');
                  if (!token) return null;
                  try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.id;
                  } catch (e) {
                    return null;
                  }
                }

                document.getElementById('new-discussion-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const title = document.getElementById('title').value;
                    const content = document.getElementById('content').value;
                    const userId = getUserIdFromToken();
                    const res = await fetch('/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, content, userId })
                    });
                    if (res.ok) {
                        alert('Discussion created!');
                        location.reload();
                    } else {
                        alert('Error creating discussion. Title: ' + escapeJsString(title) + '\nContent: ' + escapeJsString(content) + '\nUserID: ' + escapeJsString(userId));
                    }
                });

                document.getElementById('comment-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    alert('DEBUG: Submit button pressed for comment form (main page)');
                    console.log('Comment form submit handler triggered (main page)');
                    var discussionId = document.getElementById('discussion').value;
                    var comment = document.getElementById('comment').value;
                    var userId = getUserIdFromToken();
                    var titleElem = document.querySelector('#discussion option[value="' + discussionId + '"]');
                    var title = titleElem ? titleElem.textContent : 'UNKNOWN';
                    var contentElem = document.querySelector('.discussion-content');
                    var content = contentElem ? contentElem.textContent : 'UNKNOWN';
                    alert('DEBUG: About to fetch POST for comment.\nUserID: ' + escapeJsString(userId) + '\nTitle: ' + escapeJsString(title) + '\nContent: ' + escapeJsString(content));
                    try {
                        var res = await fetch('/posts/' + discussionId + '/comments', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ comment, userId })
                        });
                        if (res.ok) {
                            alert('Comment posted!');
                            location.reload();
                        } else {
                            alert('Error posting comment. Title: ' + escapeJsString(title) + '\nContent: ' + escapeJsString(content) + '\nUserID: ' + escapeJsString(userId));
                        }
                    } catch (err) {
                        alert('Network or script error posting comment. Title: ' + escapeJsString(title) + '\nContent: ' + escapeJsString(content) + '\nUserID: ' + escapeJsString(userId) + '\nError: ' + escapeJsString(err));
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

        const User = require('./models/User');
        async function getUsername(userId) {
            if (!userId) return 'UNKNOWN';
            try {
                const user = await User.findById(userId);
                return user ? user.username : 'UNKNOWN';
            } catch {
                return 'UNKNOWN';
            }
        }
        let commentsHtml = '';
            for (const c of post.comments || []) {
                const commentUser = await getUsername(c.userId);
                const commentUserId = c.userId ? c.userId.toString() : 'UNKNOWN';
                commentsHtml += `<li class="comment-item">${c.text} <em>by ${commentUser} (${commentUserId})</em></li>`;
        }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${post.title} - Discussion Board</title>
            <link rel="stylesheet" href="/discussion-board.css">
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
                                    alert('DEBUG: Script loaded and running (discussion page)');
                                // Decode JWT to get userId
                                function getUserIdFromToken() {
                                    const token = window.localStorage.getItem('authToken');
                                    if (!token) return null;
                                    try {
                                        const payload = JSON.parse(atob(token.split('.')[1]));
                                        return payload.id;
                alert('FORCE ALERT: This popup should always appear when the page loads.');
                                    } catch (e) {
                                        return null;
                                    }
                                }

                                document.getElementById('comment-form').addEventListener('submit', async function(e) {
                                                e.preventDefault();
                                                alert('DEBUG: Submit button pressed for comment form (discussion page)');
                                                console.log('Comment form submit handler triggered (discussion page)');
                                            var comment = document.getElementById('comment').value;
                                            var userId = getUserIdFromToken();
                                            var titleElem = document.querySelector('.discussion-title');
                                                var title = titleElem ? titleElem.textContent : 'UNKNOWN';
                                                var contentElem = document.querySelector('.discussion-content');
                                                var content = contentElem ? contentElem.textContent : 'UNKNOWN';
                                                var safeTitle = JSON.stringify(title);
                                                var safeContent = JSON.stringify(content);
                                                alert('DEBUG: About to fetch POST for comment.\nUserID: ' + userId + '\nTitle: ' + safeTitle + '\nContent: ' + safeContent);
                                            try {
                                                var res = await fetch('/posts/${post._id}/comments', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ comment, userId })
                                                });
                                                if (res.ok) {
                                                    alert('Comment posted!');
                                                    location.reload();
                                                } else {
                                                    alert('Error posting comment. Title: ' + title + '\nContent: ' + content + '\nUserID: ' + userId);
                                                }
                                            } catch (err) {
                                                alert('Network or script error posting comment. Title: ' + title + '\nContent: ' + content + '\nUserID: ' + userId + '\nError: ' + err);
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
        const mongoose = require('mongoose');
        const post = new Post({
            title: escapeHtml(req.body.title),
            content: escapeHtml(req.body.content),
            userId: req.body.userId ? mongoose.Types.ObjectId(req.body.userId) : undefined
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
        const mongoose = require('mongoose');
        if (!req.body.userId || !mongoose.Types.ObjectId.isValid(req.body.userId)) {
            return res.status(400).json({ error: 'Missing or invalid userId for comment.' });
        }
    post.comments.push({ text: escapeHtml(req.body.comment), userId: mongoose.Types.ObjectId(req.body.userId) });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const authRouter = require('./routes/auth');
app.use('/api', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
