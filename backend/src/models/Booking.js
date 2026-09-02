const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
}, { timestamps: true });

// Составной индекс для быстрой проверки пересечений (Требование ТЗ: Производительность)
bookingSchema.index({ room: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);