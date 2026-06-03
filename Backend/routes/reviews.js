const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Mess = require('../models/Mess');
const { protect, authorize } = require('../middleware/auth');
// ─── GET /api/reviews — All reviews (admin only) ─────────────────────────────
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name avatar email')
      .populate('mess', 'name')
      .sort({ createdAt: -1 });
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── POST /api/reviews — Write a review (student only) ───────────────────────
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { messId, rating, text } = req.body;
    if (!messId || !rating || !text)
      return res.status(400).json({ message: 'messId, rating and text are required.' });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    if (text.trim().length < 10)
      return res.status(400).json({ message: 'Review must be at least 10 characters.' });
    const mess = await Mess.findById(messId);
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    // Check duplicate
    const existing = await Review.findOne({ mess: messId, user: req.user._id });
    if (existing)
      return res.status(400).json({ message: 'You have already reviewed this mess. You can edit your review.' });
    const review = await Review.create({
      mess: messId,
      user: req.user._id,
      rating,
      text: text.trim()
    });
    const populated = await review.populate('user', 'name avatar');
    res.status(201).json({ message: 'Review posted!', review: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PUT /api/reviews/:id — Edit own review (student) ───────────────────────
router.put('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You can only edit your own review.' });
    const { rating, text } = req.body;
    if (rating) review.rating = rating;
    if (text)   review.text = text.trim();
    await review.save();
    // Recalculate mess rating
    await Review.calcAverageRating(review.mess);
    res.json({ message: 'Review updated!', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── DELETE /api/reviews/:id — Delete review (author or admin) ───────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    const isAuthor = review.user.toString() === req.user._id.toString();
    const isAdmin  = req.user.role === 'admin';
    if (!isAuthor && !isAdmin)
      return res.status(403).json({ message: 'Not authorized to delete this review.' });
    const messId = review.mess;
    await review.deleteOne();
    await Review.calcAverageRating(messId);
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PATCH /api/reviews/:id/helpful — Mark review as helpful ─────────────────
router.patch('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    const alreadyMarked = review.helpfulBy.includes(req.user._id);
    if (alreadyMarked) {
      review.helpfulBy.pull(req.user._id);
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      review.helpfulBy.push(req.user._id);
      review.helpful += 1;
    }
    await review.save();
    res.json({ helpful: review.helpful, marked: !alreadyMarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PATCH /api/reviews/:id/visibility — Admin hides/shows a review ──────────
router.patch('/:id/visibility', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    review.isVisible = !review.isVisible;
    await review.save();
    await Review.calcAverageRating(review.mess);
    res.json({ message: `Review ${review.isVisible ? 'visible' : 'hidden'}.`, isVisible: review.isVisible });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;