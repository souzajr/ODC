'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// const User = mongoose.model('User');
const moment = require('moment');

moment.locale(process.env.LOCATION);

module.exports = {
  createAdmin() {
    User.find().then(users => {
      if (!users.length) {
        const encryptPassword = password => {
          const salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(password, salt);
        };

        const user = {
          name: 'Admin',
          email: process.env.FIRSTEMAIL,
          password: encryptPassword(process.env.FIRSTPASSWORD),
          createdAt: moment().format('L - LTS'),
        };

        User.create(user).then(() =>
          console.log(
            '\x1b[41m\x1b[37m',
            'USUÁRIO ADMIN CRIADO COM SUCESSO!',
            '\x1b[0m'
          )
        );
      }
    });
  },
};
