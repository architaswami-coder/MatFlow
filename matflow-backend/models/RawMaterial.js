const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String, // e.g., 'kg', 'liters', 'pieces'
    required: true
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  unitPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);