'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

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

  const getCode = async (req, res) => {
    const { email } = req.body;

    try {
      existOrError(email, 'Digite seu Email');
      validEmailOrError(email, 'Email inválido');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(200).end();

    const token = crypto.randomBytes(64).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    // mail.recoveryMail(user.email, token);
    res.status(200).end();
  };

  const update = async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(401)
        .json('O token de redefinição de senha é inválido ou expirou');

    try {
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

    user.password = encryptPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    // mail.alertOfChange(user.email);
    res.status(200).end();
  };

  return {
    getCode,
    update,
  };
};
