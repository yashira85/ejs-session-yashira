// use dotenv to import configs from the .env file
require('dotenv').config()

// Dependencies
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()

const session = require('express-session')

// Configuration
const PORT = process.env.PORT
const mongoURI = process.env.MONGODB_URI

// Set Middleware
// allow us to use put and delete methods
app.use(methodOverride('_method'))
// parses info from our input fields into an object
app.use(express.urlencoded({ extended: false }))

// configure sessions
// secret is stored in .env
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

// Database config and connection
mongoose.connect(mongoURI, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('connected to mongo')
})

// Listen
app.listen(PORT, () => console.log('auth happening on port', PORT))

// Routes
app.get('/', (req, res) => {
  // res.send('index route')
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/app', (req, res)=>{
    if(req.session.currentUser){
        res.render('app/index.ejs')
    } else {
        res.redirect('/sessions/new');
    }
})
// Users controller - creates new users
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// Sessions controller - handles user sessions
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
