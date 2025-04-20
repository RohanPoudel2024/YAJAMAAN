const mongoose = require('mongoose');

const RitualSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a ritual name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  duration: String,
  category: String,
  basePrice: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Ritual || mongoose.model('Ritual', RitualSchema);