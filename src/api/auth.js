'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');

module.exports = app => {
  const { existOrError, validEmailOrError } = app.src.config.validation;

  const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      existOrError(email, 'Digite seu email');
      validEmailOrError(email, 'Email inválido');
      existOrError(password, 'Digite sua senha');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const user = await User.findOne({ email });
    if (!user || user.deletedAt)
      return res.status(401).json('Email ou senha inválidos');

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json('Email ou senha inválidos');

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      id: user._id,
      iss: process.env.DOMAIN_NAME,
      iat: now,
      exp: now + 60 * 60 * 24,
    };

    res.status(200).json({
      token: jwt.encode(payload, process.env.AUTH_SECRET),
    });
  };

  const validateToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
      if (
        token &&
        new Date(jwt.decode(token, process.env.AUTH_SECRET).exp * 1000) >
          new Date()
      ) {
        return res.status(200).json(req.user);
      }
    } catch (e) {
      return res.status(401).end();
    }

    res.status(401).end();
  };

  return {
    login,
    validateToken,
  };
};
