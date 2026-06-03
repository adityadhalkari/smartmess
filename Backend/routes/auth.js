const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'smartmess_secret_2024';
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, college, year } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered.' });
    // Only admin can create admin accounts
    if (role === 'admin')
      return res.status(403).json({ message: 'Cannot self-register as admin.' });
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const user = await User.create({ name, email, password, role: role || 'student', college, year, avatar: initials });
    res.status(201).json({
      message: 'Registration successful!',
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, college, year }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    res.json({
      message: 'Login successful!',
      token: signToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, avatar: user.avatar,
        college: user.college, year: user.year,
        messId: user.messId
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});
module.exports = router;