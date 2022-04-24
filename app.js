var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv')

var app = express();

dotenv.config({ path: "./config.env" })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
// const DB = 'mongodb://localhost:27017/testPost6'
mongoose.connect(DB)
  .then(res => console.log("連線資料成功"));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);

module.exports = app;
