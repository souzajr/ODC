'use strict';

const requireDir = require('require-dir');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

module.exports = {
  openConn() {
    try {
      mongoose.connect(process.env.DB_HOST);
      requireDir('../model');

      console.log(
        '\x1b[41m\x1b[37m',
        'CONECTADO COM SUCESSO NO BANCO DE DADOS',
        '\x1b[0m'
      );
    } catch (e) {
      console.log(
        '\x1b[41m\x1b[37m',
        'ERRO AO SE CONECTAR COM O BANCO DE DADOS',
        '\x1b[0m'
      );
    }
  },
};
