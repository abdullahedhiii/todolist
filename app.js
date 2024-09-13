const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const Routes= require('./routes/routes')
const cookieParser = require('cookie-parser');
const {checkUser} = require('./middleware/authMiddleware');

app.set('view engine','ejs');

const dbURL = "mongodb+srv://new-user-2:fast1234@cluster0.e5zt0.mongodb.net/mydata";
mongoose.connect(dbURL)
   .then( (result) => {
       app.listen(4001); //starts listening once db is connected
   })
   .catch((err) => {
       console.log(err);
   })

//middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended : true})) //passes this into request object
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(checkUser);
app.use('/',Routes);

