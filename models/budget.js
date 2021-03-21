const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    budget: {type:Number, default: 0},
    expenditure: {type: Number, default: 0}
})
const budget = mongoose.model('budget', budgetSchema);

module.exports = budget;