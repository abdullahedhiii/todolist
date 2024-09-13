const Task = require('../models/task');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
//mongoose hook is a special mongoose function which fires after a specific thing happens
//so in our case we will fire once a new user is created

module.exports.get_home = (req,res) =>{
    res.render('homepage',{title : 'home-page'});
}

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    
    // Specific custom errors
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password, try again?';
    }

    if (err.message === 'Incorrect email') {
        errors.email = 'Email not found, try signing up?';
    }

    return errors;
};


const maxAge = 3 * 24 * 60 * 60;
//times should be in seconds for jwt
//id => payload
const create_token = (user_id) => {
      return jwt.sign({user_id},'edhi what secret',{
         expiresIn : maxAge
      });    
}

module.exports.get_redirect = (req,res) => {
    res.redirect('/homepage');
}

module.exports.get_list = async (req,res) =>{
    // console.log(user.email);
    const user_id = res.locals.user._id;
    const result = await Task.find({user_id,date : {$gt : new Date() } ,completed : false}).sort({createdAt : -1});
    try{
        res.render('index',{title : 'homepage',items:result});
    }
    catch(err){
        console.log(err);
    }
}

module.exports.get_create = (req,res) => {
    res.render('add-task',{title : 'add task'})
}

module.exports.get_important = async (req,res) => {
    const user_id = res.locals.user._id;
    const result = await Task.find({user_id,starred : true , completed:false}).sort({createdAt : -1})
    try{
        res.render('important',{title : 'important tasks',items : result})
    }
    catch(err){
        console.log(err);
    }
}

module.exports.get_signup = (req,res) =>{
    res.render('signup',{title: 'Signup'});
}

module.exports.get_login = (req,res) =>{
    res.render('login',{title: 'login'});
}

//.then .save() are old method u should use await and async
module.exports.post_signup = async (req, res) => {
    const user = new User(req.body);
    try{
        const result = await user.save()
        const token = create_token(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, redirect: '/list' });
    }
    catch(err){
        const errors = handleErrors(err);  
        res.status(400).json({ errors });  
    }
};

module.exports.post_login = async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = create_token(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, redirect: '/list' });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.post_list = async (req, res) => {
    const { title, date, completed, starred } = req.body; // Ensure these match schema fields
    const user_id = res.locals.user._id; // Get the user ID from res.locals.user

    // Create a new task with required fields
    const task = new Task({ title, date, completed, starred, user_id });

    try {
        await task.save();
        res.redirect('/list');
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Task creation failed', details: err });
    }
};

module.exports.get_completed = async (req,res) => {
    const user_id = res.locals.user._id;
    const result = await Task.find({user_id,completed : true}).sort({createdAt : -1})
    try{
        res.render('completed',{title : 'completed tasks',items : result});
    }
    catch(err){
        console.log(err);
    }
}

module.exports.delete_task = async (req,res) => {
    const result = await Task.findByIdAndDelete(req.params.id)
    try{
        res.json({redirect : '/list'});
    }
    catch(err){
        console.log(err);
    }
 }

 module.exports.update_star =  async (req, res) => {
    const { starred } = req.body; 
    const result = await Task.findByIdAndUpdate(req.params.id, { starred }, { new: true }) 
    try{
        res.json({ redirect: '/list' });
    }
    catch(err){
            console.log( err);
    }
}

module.exports.update_important = async (req, res) => {
    const { completed } = req.body; 
    const result = await Task.findByIdAndUpdate(req.params.id, { completed }, { new: false }) 
    try{
        res.json({ redirect: '/list' });
    }
    catch(err){
        console.log(err);
    }
}

module.exports.get_missed = async (req,res) => {
    const user_id = res.locals.user._id;
     const result = await Task.find({user_id,
         date : {$lt : new Date()},
         completed:false
     }).sort({createdAt : -1})
     try{
        res.render('overdue',{title : 'Missed-tasks',items: result});
     }
     catch(err){
        console.log(err);
     }
};

module.exports.get_logout = (req,res) =>{
    res.cookie('jwt','',{maxAge :1});
    res.redirect('/');
}

// module.exports = {
//     get_redirect,
//     get_list,
//     get_important,
//     get_create,
//     get_completed,
//     update_star,
//     update_important,
//     delete_task,
//     post_list,
//     get_missed,
//     post_signup,
//     get_signup
// }