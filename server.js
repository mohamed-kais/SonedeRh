const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
var moment = require('moment');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const session = require("express-session");
var flush = require('connect-flash');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session)
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Meeting = require('google-meet-api').meet;


const flash = require('connect-flash');
const multer = require('multer');

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
/*
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
*/
const connectDB = require('./server/database/connection');
const { response } = require('express');

const app = express();


app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());






app.use(flush());

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080
app.locals.moment = require('moment');

app.use(morgan('tiny'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);



app.use(express.urlencoded({ extended: true }));

const mongoURI = require('./mongoURL');
const { extname } = require('path');
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, },).then(() => console.log("Connected !"),);


app.use(cookieParser('random'));

app.use(session({
    secret: 'random',
    resave: true,
    saveUninitialized: true,
	maxAge : 60 * 1000,
	store: new MemoryStore(),
}));


app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
	res.locals.message = req.session.message;
	delete req.session.message;
    next();
});

app.use(express.static("assets/uploads"));

//connectDB();

app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));



app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))


/*

app.post('/api/login', async (req, res) => {
	const { cin, password } = req.body
	const user = await Users.findOne({ cin }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid cin/password' })
       // res.redirect('/');
	
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				cin: user.cin
			},
			JWT_SECRET
		)
        res.redirect('/index');   
		return res.json({ status: 'ok', data: token })
	}
   
	res.json({ status: 'error', error: 'Invalid cin/password' })
})

*/

/*
app.post('/api/register', async (req, res) => {
	const { fullName,email,cin, password: plainTextPassword,password2: plainTextPassword2} = req.body
	
	
	if (!fullName || typeof fullName !== 'string') {
		return res.json({ status: 'error', error: 'Invalid fullName' })
	
	}
	if (!cin || typeof cin !== 'string') {
		return res.json({ status: 'error', error: 'Invalid cin' })
		
	}

	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
		
	}
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
		
	}
	if (!plainTextPassword2 || typeof plainTextPassword2 !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password2' })
		
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
			
		})
		
	}
	if (plainTextPassword != plainTextPassword2) {
		return res.json({
			status: 'error',
			error: 'Password dont match'
			
		})
		
	}

	

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await Users.create({
			fullName,
            email,
            cin,
			password

		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
    res.redirect('/');  
	res.json({ status: 'ok' })
})

*/

app.post('/send-email',(req,res)=>{
	console.log(req.body);
	const transporter = nodemailer.createTransport({
	  service : 'gmail',
	  auth : {
		user : 'kaism4046@gmail.com',
		pass : '183JMT0218' 
	  }
	})
	const mailOptions = {
	  from : req.body.sender,
	  to : req.body.to,
	  subject : 'Message from ${req.body.sender}', 
	  text : req.body.message
	}
	transporter.sendMail(mailOptions, (error, info)=>{
	  if(error){
	  console.log(error);
	  res.send('error');
	  }else{
		console.log('Email sent : ' + info.response);
		res.send('success');
	  }
	})
  });
  
app.post('/post', (req,res)=>{
	console.log(req.body);
	const transporter = nodemailer.createTransport({
	  service : 'gmail',
	  auth : {
		user : 'kaism4046@gmail.com',
		pass : '183JMT0218' 
	  }
	})
	const mailOptions = {
	  from : 'kaism4046@gmail.com',
	  to : req.body.mail,
	  subject : 'Mail de Candidature', 
	  text : 'juste 1 test'
	}
	
	transporter.sendMail(mailOptions, (error, info)=>{
	  if(error){
	  console.log(error);
	  res.send('error');
	  }else{
		console.log('Email sent : ' + info.response);
		res.send('success');
	  }
	})
  });


app.use('/', require('./server/routes/router')) 
app.use('/users', require('./server/routes/users')) 

app.use(require('./server/controller/routes.js'));

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});