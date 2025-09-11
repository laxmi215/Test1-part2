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

router.get('/', authMiddleware, async (req, res) => {
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

router.get('/:discussionId/posts', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ discussion: req.params.discussionId }).populate('author', 'username');
        res.send(posts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Edit a post
router.put('/posts/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        post.content = req.body.content || post.content;
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a post
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        await post.deleteOne();
        res.send({ success: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Edit a comment
router.put('/posts/:postId/comments/:commentIdx', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');
        const idx = parseInt(req.params.commentIdx, 10);
        const comment = post.comments[idx];
        if (!comment) return res.status(404).send('Comment not found');
        if (!comment.userId || comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        comment.text = req.body.text || comment.text;
        await post.save();
        res.send(comment);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a comment
router.delete('/posts/:postId/comments/:commentIdx', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');
        const idx = parseInt(req.params.commentIdx, 10);
        const comment = post.comments[idx];
        if (!comment) return res.status(404).send('Comment not found');
        if (!comment.userId || comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        post.comments.splice(idx, 1);
        await post.save();
        res.send({ success: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Edit a discussion
router.put('/:discussionId', authMiddleware, async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) return res.status(404).send('Discussion not found');
        if (discussion.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        discussion.title = req.body.title || discussion.title;
        discussion.content = req.body.content || discussion.content;
        await discussion.save();
        res.send(discussion);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a discussion
router.delete('/:discussionId', authMiddleware, async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) return res.status(404).send('Discussion not found');
        if (discussion.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        await discussion.deleteOne();
        res.send({ success: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;

