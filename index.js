const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy	= require("passport-local");
const methodOverride = require("method-override");
const User = require('./models/user');
const category = require('./models/category');
const expense = require('./models/expense');
const budget = require('./models/budget');


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))

// Passport JS
app.use(require("express-session")({
	secret: "Internship rocks",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})


mongoose.connect('mongodb://localhost:27017/expenseManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},()=>{
    console.log('Database connected');
});


app.get('/', isLoggedIn, (req,res)=>{
    category.find({user:req.user}, (err,categories)=>{
        expense.find({user: req.user}).populate('category').exec((err,expenses)=>{
            let categorydata = {}
            expenses.forEach(exp=>{
                if(exp.delete==false){
                    if(categorydata[exp.category.title]==undefined)
                    categorydata[exp.category.title]=exp.amount
                    else
                        categorydata[exp.category.title]+=exp.amount;
                }  
            })
            budget.find({user:req.user}, (err, budget)=>{
                res.render('index',{data: expenses, categories:categories, budget: budget[0],categorydata:categorydata})
            })
        })
    })
})

app.get('/settings', isLoggedIn,(req,res)=>{
    category.find({user:req.user},(err,categories)=>{
        res.render('settings',{categories:categories});
    })
})

app.post('/expense/new', isLoggedIn, (req,res) =>{
    let newexpense = req.body;
    newexpense.user = req.user;
    category.findById(req.body.category, (err,newcategory)=>{
        newexpense.category = newcategory;
        // console.log('newexpense',newexpense);
        expense.create(newexpense, (err,newexpense)=>{
            if(err)
                throw err;
            budget.findOneAndUpdate({user:req.user},{budget: 0, expenditure:req.body.amount},{upsert:true},(err,oldbudget)=>{
                if(oldbudget!=null)
                    oldbudget.expenditure = oldbudget.expenditure + newexpense.amount;
                budget.updateOne({user:req.user},oldbudget, (err,newbudget)=>{
                    res.redirect('/')
                })
            })
        })
    })
})

app.post('/expense/edit', isLoggedIn, (req,res)=>{
    req.body.delete = false;
    console.log(req.body)
    req.body.user = req.user;
    category.findById(req.body.category, (err,newcategory) =>{
        req.body.category = newcategory;
        let id = req.body.id
        delete req.body.id;
        expense.findById(id,(err,oldexpense)=>{
            let oldamt = oldexpense.amount;
            expense.findByIdAndUpdate(id, req.body, (err,newexpense)=>{
                budget.find({user:req.user},(err,oldbudget)=>{
                    oldbudget[0].expenditure = oldbudget[0].expenditure - oldamt + Number(req.body.amount);
                    budget.updateOne({user:req.user},oldbudget[0], (err,newbudget)=>{
                        res.redirect('/')
                    })
                })
            })

        })
    })
    
})


app.post('/expense/delete', isLoggedIn,(req,res)=>{
    expense.findById({_id:req.body.id },(err,newexpense)=>{
        if(err) throw err;
        let temp = newexpense.delete;
        newexpense.delete=!temp;
        expense.findByIdAndUpdate(req.body.id,newexpense,(err,updatedexpense)=>{
            
        budget.findOne({user:req.user},(err,oldbudget)=>{
            if(temp==false)
                oldbudget.expenditure-=newexpense.amount;
            else
                oldbudget.expenditure+=newexpense.amount;
            budget.updateOne({user:req.user}, oldbudget, (err,newbudget)=>{
                res.json({message: 'success'});
            })
        })
            
        })
    })
})

app.post('/category/new', isLoggedIn,(req,res) =>{
    let newcategory = req.body;
    newcategory.user = req.user;
    category.create(newcategory, (err,newcategory)=>{
        if(err)
            throw err;
        console.log('added new category')
        res.redirect('/settings')
    })
})

app.post('/budget/new', isLoggedIn, (req,res) => {
    console.log(req.body);
    budget.findOneAndUpdate({user:req.user},{budget: req.body.budget} ,{upsert:true}, (err, newbudget)=>{
        console.log('budget updated',newbudget)
        res.redirect('/settings')
    })
})



// Authentication
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',(req,res)=>{
    var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err)
		{
			console.log(err)
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
            budget.create({budget: 0, expenditure: 0,user:req.user},(err, newbudget)=>{
                console.log('budget created');
            })
			res.redirect("/");
		})
	})
})

app.get('/login',(req,res)=>{
    res.render('login');
})
app.post("/login",passport.authenticate("local", 
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}),	 function(req, res){
        console.log(req.user)

})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

app.listen('3000', ()=>{
    console.log('Server running at port 3000');
})