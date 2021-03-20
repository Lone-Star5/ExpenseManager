const express = require('express');
const app = express();
const bodyParser = require("body-parser");
// const ejs = require('ejs')
const mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/expenseManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},()=>{
    console.log('Database connected');
});


const categorySchema = new mongoose.Schema({
    title: String
})
category = mongoose.model('category', categorySchema);

const expenseSchema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref:'category'},
    itemName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    delete: {type: Boolean, default: false}
})
const expense = mongoose.model('expense',expenseSchema);

const budgetSchema = new mongoose.Schema({
    budget: Number,
    expenditure: Number
})
const budget = mongoose.model('budget', budgetSchema);


const data = [
    {
        category: 'Grocery',
        itemName: 'Eggs',
        amount: 250,
        date: '12/07/2000',
        delete: false
    }, 
    {
        category: 'Grocery',
        itemName: 'Bread',
        amount: 40,
        date: '13/07/2000',
        delete: false
    }
]
app.get('/', (req,res)=>{
    category.find({}, (err,categories)=>{

        res.render('index',{data: data, categories:categories})
    })
})

app.get('/settings',(req,res)=>{
    res.render('settings');
})

app.post('/expense/new', (req,res) =>{
    console.log(req.body);
    let newexpense = req.body;
    category.findById(req.body.category, (err,category)=>{
        newexpense.category = category;
        expense.create(newexpense, (err,newexpense)=>{
            if(err)
                throw err;
            console.log('added new expense');
            res.redirect('/')
        })
    })
})

app.post('/category/new', (req,res) =>{
    // console.log(req.body);
    let newcategory = req.body;
    category.create(newcategory, (err,newcategory)=>{
        if(err)
            throw err;
        console.log('added new category')
        res.redirect('/settings')
    })
})

app.listen('3000', ()=>{
    console.log('Server running at port 3000');
})