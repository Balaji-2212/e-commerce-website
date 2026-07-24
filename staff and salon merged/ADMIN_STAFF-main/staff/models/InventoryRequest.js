const mongoose = require('mongoose');

const inventoryRequestSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  urgency: { type: String, enum: ['Normal', 'High'], default: 'Normal' },
  station: { type: String, required: true },
  staffName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'fulfilled', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
inventoryRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);
