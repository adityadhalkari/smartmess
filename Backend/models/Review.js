const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  mess:    { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  text:    { type: String, required: true, minlength: 10, maxlength: 1000 },
  helpful: { type: Number, default: 0 },
  helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });
// One review per user per mess
reviewSchema.index({ mess: 1, user: 1 }, { unique: true });
// After save/delete: recalculate mess rating
reviewSchema.statics.calcAverageRating = async function (messId) {
  const stats = await this.aggregate([
    { $match: { mess: messId, isVisible: true } },
    { $group: { _id: '$mess', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const Mess = require('./Mess');
  if (stats.length > 0) {
    await Mess.findByIdAndUpdate(messId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  } else {
    await Mess.findByIdAndUpdate(messId, { rating: 0, reviewCount: 0 });
  }
};
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.mess);
});
reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.mess);
});
module.exports = mongoose.model('Review', reviewSchema);