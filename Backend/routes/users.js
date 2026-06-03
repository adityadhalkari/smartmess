const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mess = require('../models/Mess');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');
// ─── GET /api/users — All users (admin only) ─────────────────────────────────
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── GET /api/users/:id — Single user profile ────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PUT /api/users/:id — Update own profile ─────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized.' });
    const allowed = ['name', 'college', 'year', 'avatar'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated!', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PATCH /api/users/:id/deactivate — Admin deactivates user ────────────────
router.patch('/:id/deactivate', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── DELETE /api/users/:id — Admin deletes user ───────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await Review.deleteMany({ user: req.params.id });
    await user.deleteOne();
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── GET /api/users/:id/reviews — All reviews by a user ──────────────────────
router.get('/:id/reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.id })
      .populate('mess', 'name image category')
      .sort({ createdAt: -1 });
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;