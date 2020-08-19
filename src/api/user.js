'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

module.exports = app => {
  const {
    existOrError,
    validEmailOrError,
    notExistOrError,
    hasDigitOrError,
    hasLowerOrError,
    hasUpperOrError,
    notSpaceOrError,
    hasSpecialOrError,
    strongOrError,
    equalsOrError,
  } = app.src.config.validation;

  const encryptPassword = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const store = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    try {
      existOrError(email, 'Digite seu email');
      validEmailOrError(email, 'Email inválido');
      const userFromDB = await User.findOne({ email });
      notExistOrError(userFromDB, 'Esse Email já está registrado');
      existOrError(password, 'Digite sua senha');
      hasDigitOrError(password, 'A senha deve ter pelo menos um número');
      hasLowerOrError(
        password,
        'A senha deve ter pelo menos uma letra minúscula'
      );
      hasUpperOrError(
        password,
        'A senha deve ter pelo menos uma letra maiúscula'
      );
      notSpaceOrError(password, 'A senha não deve ter espaços em branco');
      hasSpecialOrError(
        password,
        'A senha deve ter pelo menos um caractere especial'
      );
      strongOrError(password, 'A senha deve conter pelo menos 8 caracteres');
      existOrError(confirmPassword, 'Digite a confirmação da senha');
      equalsOrError(
        password,
        confirmPassword,
        'A senha e confirmação da senha não são iguais'
      );
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const user = {
      email,
      password: encryptPassword(password),
    };

    await User.create(user);
    res.status(200).end();
  };

  const index = (req, res) => {
    if (req.user)
      return res.status(200).json({ user: req.user, msg: 'Success' });

    res.status(401).json({ user: null, msg: 'Failed' });
  };

  const update = async (req, res) => {
    const { id: _id, email, password, confirmPassword } = req.body;

    if (!_id) return res.status(400).json('Algo deu errado');

    const user = await User.findOne({ _id });

    if (!user) return res.status(400).json('Algo deu errado');

    if (email) {
      try {
        validEmailOrError(email);
        const userFromDB = await User.findOne({ email });
        notExistOrError(userFromDB, 'Esse Email já está registrado');
      } catch (msg) {
        return res.status(400).json(msg);
      }

      user.email = email;
    }

    if (password) {
      try {
        hasDigitOrError(password, 'A senha deve ter pelo menos um número');
        hasLowerOrError(
          password,
          'A senha deve ter pelo menos uma letra minúscula'
        );
        hasUpperOrError(
          password,
          'A senha deve ter pelo menos uma letra maiúscula'
        );
        notSpaceOrError(password, 'A senha não deve ter espaços em branco');
        hasSpecialOrError(
          password,
          'A senha deve ter pelo menos um caractere especial'
        );
        strongOrError(password, 'A senha deve conter pelo menos 8 caracteres');
        existOrError(confirmPassword, 'Digite a confirmação da senha');
        equalsOrError(
          password,
          confirmPassword,
          'A senha e confirmação da senha não são iguais'
        );
      } catch (msg) {
        return res.status(400).json(msg);
      }

      user.password = encryptPassword(password);
    }

    await user.save();
    res.status(200).end();
  };

  return {
    store,
    index,
    update,
  };
};
