const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/authMiddleware');
const {checkUser} = require('./middleware/authMiddleware');

const app = express();
app.listen(3000);

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');


// Database 
mongoose.set('strictQuery', false);
const db = require('./src/database/db');

// routes
app.get('*',checkUser);
app.get('/',(req,res)=>{
  res.render('home')
});

app.get('/smoothies',requireAuth,(req,res)=>{
  res.render('smoothies');
});

app.use(authRoutes);


// ----------Cookies------------
// app.get('/set-cookies',(req,res)=>{
//   // res.setHeader('Set-Cookie','newUser=true');
//   res.cookie('newUser',false);
//   // res.cookie('isEmployee',true,{maxAge :1000*60*60*24,secure:true});
//   res.cookie('isEmployee',true,{maxAge :1000*60*60*24,httpOnly:true});
//   res.send('you got the cookies');
// });

// app.get('/read-cookies',(req,res)=>{
//   const cookies = req.cookies;

//   // console.log(cookies);
//   // console.log(cookies.newUser);
//   res.json(cookies);
// });