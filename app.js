const express = require('express');
const mongoose = require('mongoose');
const expessLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

// Passport Config
require('./config/passport')(passport);

// Connect To Database
mongoose.connect(config.database, {
  useNewUrlParser: true
});

let db = mongoose.connection;

// Check Connection
db.once('open', function() {
  console.log('MongoDB Connected...');
});

// Check for DB errors
db.on('error', function(err) {
  console.log(err);
});

// Application Initialization
const app = express();

// EJS
app.use(expessLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended:false }));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`));
