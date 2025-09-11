// routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered.' });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.send({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;