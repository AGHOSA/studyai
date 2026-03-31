const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        streak: user.streak
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // ✅ Update streak on login
    const now = new Date();
    const last = user.lastStudiedAt ? new Date(user.lastStudiedAt) : null;

    if (!last) {
      user.streak = 1;
    } else {
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      } else if (diffDays === 0) {
        if (user.streak === 0) user.streak = 1;
      }
    }

    user.lastStudiedAt = now;
    await user.save();

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        streak: user.streak,
        aiCreditsUsed: user.aiCreditsUsed
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      streak: user.streak,
      aiCreditsUsed: user.aiCreditsUsed,
      subjects: user.subjects
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/update-progress
router.post('/update-progress', protect, async (req, res) => {
  try {
    const { subject, score } = req.body;
    const user = await User.findById(req.user._id);

    const existing = user.subjects.find(s => s.name === subject);
    if (existing) {
      existing.progress = Math.round((existing.progress + score) / 2);
    } else {
      user.subjects.push({ name: subject, progress: score });
    }

    await user.save();
    res.json({ subjects: user.subjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;