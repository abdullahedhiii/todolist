const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.requireAuthentication = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'edhi what secret' ,
            (err,decodedToken) =>{
                 if(err){
                    res.redirect('homepage');
                 }
                 else{
                    next();
                 }    
            }
        );
    }
    else{
        res.redirect('homepage');
    }
};


module.exports.checkUser = (req,res,next) =>{
     const token = req.cookies.jwt;
     if(token)
     {
        jwt.verify(token,'edhi what secret',async(err,decodedToken) => {
            if(err)
            {
                res.locals.user = null;
                console.log('error');
                next();
            }
            else{
                console.log(decodedToken);
                const user = await User.findById(decodedToken.user_id);
                res.locals.user = user;
                console.log('user saved',res.locals.user);
                next();
            }
        })
     }
     else{
           res.locals.user = null;
           next();
     }
}