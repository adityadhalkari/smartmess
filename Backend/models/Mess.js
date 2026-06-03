const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
  breakfast: [String],
  lunch:     [String],
  snacks:    [String],
  dinner:    [String],
}, { _id: false });
const messSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName:   { type: String },
  category: {
    type: String,
    enum: ['veg', 'nonveg', 'vegan', 'jain', 'combo', 'tiffin'],
    required: true
  },
  address:     { type: String, required: true },
  city:        { type: String, default: 'Mumbai' },
  pincode:     { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  price:       { type: Number, required: true },
  priceUnit:   { type: String, default: '/month' },
  capacity:    { type: Number, required: true },
  enrolled:    { type: Number, default: 0 },
  timing:      { type: String },
  weeklySpecial: { type: String },
  todayMenu:   { type: menuSchema, default: {} },
  tags:        [String],
  amenities:   [String],
  image:       { type: String, default: ' ' },
  isOpen:      { type: Boolean, default: true },
  isVerified:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  googleMaps:    { type: String, default: '' },
  // Computed from reviews
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });
// Virtual: available seats
messSchema.virtual('availableSeats').get(function () {
  return this.capacity - this.enrolled;
});
module.exports = mongoose.model('Mess', messSchema);