'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

module.exports = app => {
  app.use(helmet());
  if (process.env.AMBIENT_MODE === 'PROD') {
    const expressEnforcesSsl = require('express-enforces-ssl');
    app.enable('trust proxy');
    app.use(expressEnforcesSsl());
  }
  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
};
