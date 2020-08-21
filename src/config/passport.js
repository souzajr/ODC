'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
  const params = {
    secretOrKey: process.env.AUTH_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    User.findOne({ _id: payload.id })
      .then(user => done(null, user))
      .catch(() => done(null, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
