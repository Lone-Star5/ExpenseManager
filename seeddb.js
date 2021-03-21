const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/expenseManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},()=>{
    console.log('Database connected');
});
const budgetSchema = new mongoose.Schema({
    budget: {type:Number, default: 0},
    expenditure: {type: Number, default: 0}
})
const budget = mongoose.model('budget', budgetSchema);

budget.create({budget: 0, expenditure: 0},(err, newbudget)=>{
    console.log('budget created');
})