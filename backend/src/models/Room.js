const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  capacity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  description: { 
    type: String, 
    trim: true 
  },
  image: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);