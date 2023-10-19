const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const { engine: hbs } = require('express-handlebars');

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const db = require('./config/connection');

const app = express();

// Middleware for setting Cache-Control header
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));

// Logging and body parsing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// File upload middleware
app.use(fileUpload());

// Session middleware
app.use(session({
  secret: "jusair", // Replace with your secret key
  cookie: { maxAge: 600000 }
}));

// Database connection
db.connect((err) => {
  if (err) {
    console.log("Database connection error: " + err);
  } else {
    console.log("Database connected to port 27017");
  }
});

// Routes
app.use('/', userRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
