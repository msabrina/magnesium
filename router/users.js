const express = require('express');
const { createUser } = require('../models/user.js');
const { authenticate } = require('../lib/auth');
const { pictureThis } = require('../services/recognition');
const { getImage } = require('../services/images');
const { imageThis } = require('../services/recognition');
const { saveSelected } = require('../models/server');
const { deleteSelected } = require('../models/server');
const { getFavorites } = require('../models/server');

const usersRouter = express.Router();

/**
 * Creates a new user by handling the POST request from a form with action `/users`
 * It uses the createUser middleware from the user model
 */
usersRouter.post('/', createUser, (req, res) => {
  res.redirect('/');
});

/**
 * Takes the user to its profile by handling any GET request to `/users/profile`
 * It redirects to /login when attempted to be reached by a non logged in user
 * It is "protected" by the authenticate middleware from the auth library
 */
usersRouter.get('/profile', authenticate, (req, res) => {
  res.render('users/profile', { user: res.user });
  // console.log(req.session)
  // res.json(req.session)
});

// usersRouter.get('/profile', getImage, (req, res) => {
//     console.log('show me the prob!');
//   res.json('/users/profile', { image: res.image });
// });

usersRouter.get('/images', authenticate, getImage, (req, res) => {
  res.render('users/images', {
    user: res.user,
    image: res.image,
  });
});

usersRouter.get('/analyze', pictureThis, getFavorites, (req, res) => {
  res.render('users/watson', {
    watsonResults: res.watsonRes,
    imageUrl: req.query.url,
    favorites: res.favorites,
  });
  // res.json(res.watsonRes);
});

usersRouter.get('/favorites', authenticate, getFavorites, (req, res) => {
  console.log('favorites *****', res.favorites);
  res.render('users/favorites', {
    user: res.user,
    favorites: res.favorites,
  });
  // res.json(res.watsonRes);
});

usersRouter.post('/save', saveSelected, (req, res) => {
  res.redirect('/users/favorites');
});

usersRouter.delete('/save', deleteSelected, (req, res) => {
  res.redirect('/');
});
// usersRouter.get('/profile', authenticate, getImage, pictureThis, (req, res) => {
//   console.log('here');
//   res.render('users/profile', {
//     user: res.user,
//     image: res.image,
//     watsonResults: res.watsonRes,
//   });
//   // res.json(res.image);
// });

module.exports = usersRouter;
