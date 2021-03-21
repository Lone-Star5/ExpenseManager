# Expense Manager

It is an Expense Manager Application where users can allocate a budget, and track down their expenses for various items that they spend money on. It shows the data in graphical manner using Pie Chart and Bar graph. User can add different categories for adding their expenses and can get a summary of how much they have spent with respect to the budget allocated.

# Screenshots
![image 1](/images/Screenshot_1.png?raw=true)
![image 2](/images/Screenshot_2.png?raw=true)
![image 3](/images/Screenshot_3.png?raw=true)


## Installation

You first need to download NodeJs which can be found [here](https://nodejs.org/en/download/)

Now you need to download MongoDB which can be found [here](https://docs.mongodb.com/manual/administration/install-community/)


After installing NodeJs and MongoDB, Use the git clone command to clone the repository

```bash
git clone https://github.com/Lone-Star5/ExpenseManager.git
```

Open the folder where you have cloned the repository in your terminal and type the following command to download all the dependencies

```bash
npm install
```

Make sure you have your mongodb running using the command `sudo service mongodb status`
If the mongodb shows status fail, then run the following command to start mongodb

```bash
sudo service mongodb start
```

Now you can start the server using the following command and open `localhost:3000` in your browser to view the wesbite.

```bash
node index.js
```


## Libraries Used

[express](https://www.npmjs.com/package/express)
[mongoose](https://www.npmjs.com/package/mongoose)
[passport](https://www.npmjs.com/package/passport)
[ejs](https://www.npmjs.com/package/ejs)
[body-parser](https://www.npmjs.com/package/body-parser)
[chart.js](https://www.chartjs.org/)
[bootstrap](https://getbootstrap.com/)


