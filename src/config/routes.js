'use strict';

const admin = require('./admin');

module.exports = app => {
  app.get('/', app.src.controller.post.index);

  // #region HANDLE ERROR
  app.use((err, req, res, next) => res.status(500).json({
    message: 'Algo deu errado',
    error: true,
    content: null
  }));

  app.get('*', (req, res) => res.status(404).json({
    message: 'URL não encontrada',
    error: true,
    content: null
  }));
  // #endregion
};
