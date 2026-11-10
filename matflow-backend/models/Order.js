const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  items: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required: true
      },
      quantityUsed: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Production', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);