const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  yajaman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  brahmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ritual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ritual'
  },
  date: Date,
  time: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);