// routes/discussions.js
const express = require('express');
const Discussion = require('../models/Discussion');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const discussion = new Discussion({
            title,
            content,
            author: req.user.id,
        });
        await discussion.save();
        res.status(201).send(discussion);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const discussions = await Discussion.find().populate('author', 'username');
        res.send(discussions);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/:discussionId/posts', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const post = new Post({
            content,
            author: req.user.id,
            discussion: req.params.discussionId,
        });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:discussionId/posts', async (req, res) => {
    try {
        const posts = await Post.find({ discussion: req.params.discussionId }).populate('author', 'username');
        res.send(posts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;

