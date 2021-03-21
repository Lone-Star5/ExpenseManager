const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    category: {type: mongoose.Schema.Types.ObjectId, ref:'category'},
    itemName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    delete: {type: Boolean, default: false}
})
const expense = mongoose.model('expense',expenseSchema);

module.exports = expense;