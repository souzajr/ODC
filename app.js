'use strict';

const express = require('express');

const app = express();
const consign = require('consign');
const db = require('./src/config/db');
require('dotenv').config();

db.openConn();

app.use(express.static(__dirname));

consign()
  .include('./src/config/passport.js')
  .then('./src/config/middlewares.js')
  .then('./src/config/validation.js')
  .then('./src/api')
  .then('./src/config/routes.js')
  .into(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor funcionando na porta ${process.env.PORT}`);
  if (process.env.AMBIENT_MODE === 'DEV')
    console.log('\x1b[41m\x1b[37m', 'MODO DE DESENVOLVIMENTO', '\x1b[0m');
});
