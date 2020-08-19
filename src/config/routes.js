'use strict';

const admin = require('./admin');

module.exports = app => {
  app.get('/', app.src.api.post.index);
  /* ============= LOGIN ============= */
  app.post('/login', app.src.api.auth.login);

  /* ============= VALIDATE TOKEN ============= */
  app
    .route('/validate-token')
    .all(app.src.config.passport.authenticate())
    .get(app.src.api.auth.validateToken);

  /* ============= USER ============= */
  app
    .route('/user')
    .post(app.src.api.user.store)
    .all(app.src.config.passport.authenticate())
    .get(app.src.api.user.index)
    .put(app.src.api.user.update);

  /* ============= FORGOT PASSWORD ============= */
  app.post('/forgot-password', app.src.api.recoverPassword.getCode);
  app.post('/recover-password', app.src.api.recoverPassword.update);

  // #region HANDLE ERROR
  if (process.env.AMBIENT_MODE === 'PROD') {
    app.use(function(err, req, res, next) {
      res.status(500).json('Algo deu errado');
    });

    app.get('*', function(req, res) {
      res.status(404).json('Não encontrado');
    });
  }
  // #endregion
};
