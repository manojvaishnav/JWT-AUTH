// controller actions
const user = require('../src/Models/user');
const jwt = require('jsonwebtoken');

// Error Handle
const handleError = (err)=>{
  // console.log(err.message,err.code);
  let errors = {email:'',password:''}

  // incorrect email when login
  if(err.message ==='incorrect email'){
    errors.email = 'Incorrect email';
  }
  // incorrect password when login
  if(err.message ==='incorrect password'){
    errors.password = 'Incorrect password';
  }

  // duplicate error code
  if(err.code===11000){
    errors.email='Email is already registered';
    return errors;
  }
  // validation error
  if(err.message.includes('user validation failed')){
    // console.log(Object.values(err.errors));
    Object.values(err.errors).forEach((properties)=>{
      errors[properties.path]=properties.message;
    });
  }

  return errors;
}

// JWT
const maxAge = 3*60*60*24;
const createToken = (id)=>{
  return jwt.sign({id},'mk secret',{
    expiresIn:maxAge
  });
}

// Signup Page Get Method
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

// Login Page Get Method
module.exports.login_get = (req, res) => {
  res.render('login');
}

// SignUp Page Post Method
module.exports.signup_post = async (req, res) => {
  const {email,password}=req.body;
  try {
    const result = new user({
      email:email,
      password:password
    });
    const data = await result.save();
    const token = createToken(data._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(201).json({user:data._id});
  } catch (error) {
    const err = handleError(error);
    res.json(err);
  }
}

// Login Page Post Method
module.exports.login_post = async (req, res) => {
  const {email,password}=req.body;
  try {
    const result = await user.login(email,password);
    const token = createToken(result._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(200).json({user:result._id});
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
}

// Logout get method
module.exports.logout_get = async (req,res)=>{
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/');
}