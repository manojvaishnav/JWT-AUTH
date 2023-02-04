const jsonWeb = require('jsonwebtoken');
const user = require('../src/Models/user');

// Auth
const requireAuth =(req,res,next)=>{
    const token = req.cookies.jwt;

    // check json web token is exists & verified
    if(token){
        jsonWeb.verify(token, 'mk secret',(err,decodedToken)=>{
            if(err){
                res.redirect('/login');
            }
            else{
                // console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

// Check current user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jsonWeb.verify(token, 'mk secret',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                // console.log(decodedToken);
                let result = await user.findById(decodedToken.id);
                res.locals.user = result;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth,checkUser}