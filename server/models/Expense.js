const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Rental', 'Purchase'], required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
