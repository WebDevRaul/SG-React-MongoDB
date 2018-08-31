const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

//------------------------------------

//Load User Scheema
const User = mongoose.model('users'); // const User = require('../models/Users');

//------------------------------------

//Cookie!?!?!?!

//serializeUser
passport.serializeUser((user, done) => {

  done(null, user.id);
});

//deserializeUser
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

//------------------------------------

passport.use(new GoogleStrategy(
  { 
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  // (accessToken, refreshToken, profile, done) => {
  //   User.findOne({ googleId: profile.id })
  //     .then(existingUser => {
  //       if (existingUser) {
  //         done(null, existingUser);
  //       } else {
  //         new User({ googleId: profile.id })
  //         .save()
  //         .then(user => done(null, user));
  //       }
  //     })
  //     .catch(err => console.log(err));
  // }

  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return  done(null, existingUser)
    }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);

  }
));