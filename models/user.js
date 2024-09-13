const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator'); 
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email:{
        type : String,
        required: [true,"Please enter an email"],
        unique: true,
        lowercase:true,
        validate : [isEmail,'Please enter a valid email']
    },
    password:{
        type: String,
        required:[true,"Please enter a password"],
        minlength: [8,'The minimum length for password is 8']
    }
})

//something happening after an event has happened
//doc = user that was created
//if we leave next out the code will hang,no response
//this is a mongoose hook
// userSchema.post('save',function (doc, next){
//     console.log('new user was created and saved',doc);
//     next();
// })

//before user is saved
//this refers to user instance
//the instance is created locally before it is save and thats what this refers to
userSchema.pre('save',async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//static method to login user

userSchema.statics.login = async (email,password) => {
     const user = await User.findOne({email}); //this refers to user model  
     //if it finds the user,the user is returned else undefined
     if(user){
          const auth = await bcrypt.compare(password,user.password);
          if(auth){
            //  console.log('waht 2');
               return user;
          }
            throw Error('Incorrect password'); 
     }
        throw Error('Incorrect email'); 
}



const User = mongoose.model('User',userSchema);
module.exports = User;