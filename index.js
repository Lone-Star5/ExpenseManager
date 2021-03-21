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
    budget: {type:Number, default: 0},
    expenditure: {type: Number, default: 0}
})
const budget = mongoose.model('budget', budgetSchema);

// budget.create({budget: 0, expenditure: 0},(err, newbudget)=>{
//     console.log('budget created');
// })

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
        expense.find({}).populate('category').exec((err,expenses)=>{
            // console.log(expenses);
            res.render('index',{data: expenses, categories:categories})
        })
    })
})

app.get('/settings',(req,res)=>{
    res.render('settings');
})

app.post('/expense/new', (req,res) =>{
    let newexpense = req.body;
    category.findById(req.body.category, (err,newcategory)=>{
        newexpense.category = newcategory;
        // console.log('newexpense',newexpense);
        expense.create(newexpense, (err,newexpense)=>{
            if(err)
                throw err;
            budget.findOneAndUpdate({},{budget: 0, expenditure:req.body.amount},(err,oldbudget)=>{
                if(oldbudget!=null)
                    oldbudget.expenditure = oldbudget.expenditure + newexpense.amount;
                budget.updateOne({},oldbudget, (err,newbudget)=>{
                    res.redirect('/')
                })
            })
        })
    })
})

app.post('/expense/edit', (req,res)=>{
    req.body.delete = false;
    category.findById(req.body.category, (err,newcategory) =>{
        req.body.category = newcategory;
        let id = req.body.id
        delete req.body.id;
        expense.findById(id,(err,oldexpense)=>{
            let oldamt = oldexpense.amount;
            expense.findByIdAndUpdate(id, req.body, (err,newexpense)=>{
                budget.find({},(err,oldbudget)=>{
                    oldbudget[0].expenditure = oldbudget[0].expenditure - oldamt + Number(req.body.amount);
                    budget.updateOne({},oldbudget[0], (err,newbudget)=>{
                        res.redirect('/')
                    })
                })
            })

        })
    })
    
})

app.post('/category/new', (req,res) =>{
    let newcategory = req.body;
    category.create(newcategory, (err,newcategory)=>{
        if(err)
            throw err;
        console.log('added new category')
        res.redirect('/settings')
    })
})

app.post('/budget/new', (req,res) => {
    console.log(req.body);
    budget.findOneAndUpdate({},{budget: req.body.budget,expenditure: 0} ,{upsert:true}, (err, newbudget)=>{
        console.log('budget updated',newbudget)
        res.redirect('/settings')
    })
})



app.listen('3000', ()=>{
    console.log('Server running at port 3000');
})