const express = require('express');
const router = express.Router();
const Mess = require('../models/Mess');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');
// ─── GET /api/messes — Get all messes (public, with filters) ─────────────────
router.get('/', async (req, res) => {
  try {
    const { category, city, search, sort, open, verified } = req.query;
    const filter = { isActive: true };
    if (category)  filter.category = category;
    if (city)      filter.city = new RegExp(city, 'i');
    if (open)      filter.isOpen = open === 'true';
    if (verified)  filter.isVerified = verified === 'true';
    if (search)    filter.$or = [
      { name: new RegExp(search, 'i') },
      { address: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];
    let sortObj = { createdAt: -1 };
    if (sort === 'rating')  sortObj = { rating: -1 };
    if (sort === 'price')   sortObj = { price: 1 };
    if (sort === 'newest')  sortObj = { createdAt: -1 };
    const messes = await Mess.find(filter)
      .sort(sortObj)
      .populate('owner', 'name email avatar');
    res.json({ count: messes.length, messes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── GET /api/messes/:id — Get single mess ───────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id)
      .populate('owner', 'name email avatar');
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    res.json({ mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── GET /api/messes/:id/reviews — Reviews for a mess ───────────────────────
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ mess: req.params.id, isVisible: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── POST /api/messes — Add new mess (owner or admin) ───────────────────────
router.post('/', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const {
      name, category, address, city, pincode, price, priceUnit,
      capacity, timing, weeklySpecial, tags, amenities, image, todayMenu
    } = req.body;
    if (!name || !category || !address || !price || !capacity)
      return res.status(400).json({ message: 'name, category, address, price, capacity are required.' });
    const mess = await Mess.create({
      name, category, address, city, pincode, price,
      priceUnit: priceUnit || '/month',
      capacity, timing, weeklySpecial,
      tags: tags || [],
      amenities: amenities || [],
      image: image || ' ',
      todayMenu: todayMenu || {},
      owner: req.user._id,
      ownerName: req.user.name,
    });
    // Link mess to owner user
    if (req.user.role === 'owner') {
      await User.findByIdAndUpdate(req.user._id, { messId: mess._id });
    }
    res.status(201).json({ message: 'Mess created successfully!', mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PUT /api/messes/:id — Update mess (owner of this mess or admin) ─────────
router.put('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    // Owner can only edit their own mess
    if (req.user.role === 'owner' && mess.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You can only edit your own mess.' });
    const allowed = [
      'name','address','city','pincode','price','priceUnit','capacity',
      'enrolled','timing','weeklySpecial','tags','amenities','image',
      'isOpen','todayMenu','category'
    ];
    // Admin-only fields
    if (req.user.role === 'admin') allowed.push('isVerified', 'isActive');
    allowed.forEach(field => {
      if (req.body[field] !== undefined) mess[field] = req.body[field];
    });
    await mess.save();
    res.json({ message: 'Mess updated!', mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── DELETE /api/messes/:id — Delete mess (admin only) ───────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    // Delete all reviews for this mess too
    await Review.deleteMany({ mess: req.params.id });
    await mess.deleteOne();
    res.json({ message: 'Mess and its reviews deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PATCH /api/messes/:id/verify — Admin verifies a mess ───────────────────
router.patch('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const mess = await Mess.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    res.json({ message: 'Mess verified!', mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PATCH /api/messes/:id/toggle — Open/Close a mess ────────────────────────
router.patch('/:id/toggle', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    if (req.user.role === 'owner' && mess.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your mess.' });
    mess.isOpen = !mess.isOpen;
    await mess.save();
    res.json({ message: `Mess is now ${mess.isOpen ? 'Open' : 'Closed'}`, isOpen: mess.isOpen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;