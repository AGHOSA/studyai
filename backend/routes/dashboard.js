const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');

// GET /api/dashboard — fetch all dashboard stats
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Count notes and quizzes
    const noteCount = await Note.countDocuments({ user: req.user._id });
    const quizCount = await Quiz.countDocuments({ user: req.user._id });

    res.json({
      streak: user.streak || 0,
      noteCount,
      quizCount,
      subjects: user.subjects || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/subject — update subject progress
router.post('/subject', protect, async (req, res) => {
  try {
    const { name, progress } = req.body;
    if (!name || progress === undefined) {
      return res.status(400).json({ error: 'Name and progress are required.' });
    }

    const user = await User.findById(req.user._id);

    const existing = user.subjects.find(s => s.name === name);
    if (existing) {
      existing.progress = progress;
    } else {
      user.subjects.push({ name, progress });
    }

    await user.save();
    res.json({ subjects: user.subjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;