'use strict';

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

module.exports = {
  openConn() {
    mongoose
      .connect(process.env.DB_HOST)
      .then(() =>
        console.log(
          '\x1b[41m\x1b[37m',
          'SUCCESSFULLY CONNECTED TO DATABASE',
          '\x1b[0m'
        )
      )
      .catch(() =>
        console.log(
          '\x1b[41m\x1b[37m',
          'ERROR CONNECTING TO DATABASE',
          '\x1b[0m'
        )
      );
    require('../model/userModel');
  },
};
