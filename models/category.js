const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String
})
category = mongoose.model('category', categorySchema);
module.exports = category