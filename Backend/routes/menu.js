const express = require('express');
const router = express.Router();
const Mess = require('../models/Mess');
const { protect, authorize } = require('../middleware/auth');
// ─── GET /api/menu/:messId — Get today's menu (public) ───────────────────────
router.get('/:messId', async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.messId).select('name todayMenu weeklySpecial timing');
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    res.json({
      messName: mess.name,
      timing: mess.timing,
      weeklySpecial: mess.weeklySpecial,
      todayMenu: mess.todayMenu,
      lastUpdated: mess.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ─── PUT /api/menu/:messId — Update today's menu (owner only) ────────────────
router.put('/:messId', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.messId);
    if (!mess) return res.status(404).json({ message: 'Mess not found.' });
    if (req.user.role === 'owner' && mess.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You can only update your own mess menu.' });
    const { breakfast, lunch, snacks, dinner, weeklySpecial } = req.body;
    mess.todayMenu = {
      breakfast: breakfast || mess.todayMenu.breakfast || [],
      lunch:     lunch     || mess.todayMenu.lunch     || [],
      snacks:    snacks    || mess.todayMenu.snacks    || [],
      dinner:    dinner    || mess.todayMenu.dinner    || [],
    };
    if (weeklySpecial) mess.weeklySpecial = weeklySpecial;
    await mess.save();
    res.json({ message: 'Menu updated in real-time! ', todayMenu: mess.todayMenu });
        } catch (err) {

    res.status(500).json({ message: err.message });
         }
         });
module.exports = router;