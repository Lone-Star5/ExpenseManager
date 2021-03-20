const express = require('express');
const app = express();
// const ejs = require('ejs')
const mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/expenseManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},()=>{
    console.log('Database connected');
});

const expenseSchema = new mongoose.Schema({
    category: String,
    itemName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    delete: Boolean
})

const expense = mongoose.model('expense',expenseSchema);

app.get('/', (req,res)=>{
    res.render('index')
})

app.listen('3000', ()=>{
    console.log('Server running at port 3000');
})