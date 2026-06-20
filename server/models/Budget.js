const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  limit: { type: Number, default: 500000 },
  alertAt80: { type: Boolean, default: true },
  alertAt100: { type: Boolean, default: true }
});

module.exports = mongoose.model('Budget', budgetSchema);
