const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
 
const { protect } = require('../middleware/auth');
const Note = require('../models/Note');
const Chat = require('../models/Chat');
const User = require('../models/User');
 
// 🔁 OpenAI API function
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
 
async function generateAIResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });
 
    return response.choices[0].message.content;
  } catch (error) {
    console.log("FULL ERROR:", error);
    return "AI is currently unavailable. Try again later.";
  }
}
 
// 📄 File upload setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  }
});
 
// 💳 Credit system
const checkCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.canUseAI()) {
      return res.status(429).json({
        error: 'Daily AI limit reached.',
        upgradeRequired: user.plan === 'free'
      });
    }
    user.aiCreditsUsed += 1;
    await user.save();
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
// 📝 Summarize text
router.post('/summarize', protect, checkCredits, async (req, res) => {
  try {
    const { text, title, subject } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 characters.' });
    }
 
    const summary = await generateAIResponse(
      `Summarize these notes into clear exam-focused bullet points. Use ✅ for key concepts, 💡 for definitions, ⚠️ for mistakes:\n\n${text}`
    );
 
    const note = await Note.create({
      user: req.user._id,
      title: title || 'Untitled Note',
      originalText: text,
      summary,
      subject: subject || 'General'
    });
 
    res.json({ summary, noteId: note._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// 📄 Summarize PDF
router.post('/summarize-pdf', protect, checkCredits, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF uploaded.' });
 
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.substring(0, 8000);
 
    const summary = await generateAIResponse(
      `Summarize this document into exam-focused bullet points:\n\n${text}`
    );
 
    const note = await Note.create({
      user: req.user._id,
      title: req.file.originalname.replace('.pdf', ''),
      originalText: text,
      summary,
      subject: req.body.subject || 'General'
    });
 
    res.json({ summary, noteId: note._id, extractedLength: text.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// 💬 Chat
router.post('/chat', protect, checkCredits, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });
 
    const reply = await generateAIResponse(
      `You are a friendly tutor. Explain clearly with examples:\n\n${message}`
    );
 
    let savedChat;
 
    if (chatId) {
      savedChat = await Chat.findOneAndUpdate(
        { _id: chatId, user: req.user._id },
        {
          $push: {
            messages: [
              { role: 'user', content: message },
              { role: 'assistant', content: reply }
            ]
          }
        },
        { new: true }
      );
    } else {
      savedChat = await Chat.create({
        user: req.user._id,
        title: message.substring(0, 50),
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: reply }
        ]
      });
    }
 
    res.json({ reply, chatId: savedChat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ❓ Quiz generator
router.post('/generate-quiz', protect, checkCredits, async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required.' });
 
    let raw = await generateAIResponse(
      `Generate ${Math.min(parseInt(count), 10)} MCQ questions on "${topic}".
Return ONLY a valid JSON array. No explanation, no extra text, no markdown.
Format exactly like this:
[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","explanation":"..."}]`
    );

    raw = raw.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(raw);
 
    res.json({ questions, topic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// 📅 Study plan
router.post('/study-plan', protect, checkCredits, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) {
      return res.status(400).json({ error: 'Please describe your situation.' });
    }
 
    const plan = await generateAIResponse(
      `Create a day-by-day study plan for: ${description}`
    );
 
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;