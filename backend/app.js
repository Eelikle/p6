
//mongodb connection mongodb+srv://eelikalepasild:<password>@cluster0.di067.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://eelika:Kinross123@cluster0.di067.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  app.use(bodyParser.json());


app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);

module.exports = app;