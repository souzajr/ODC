'use strict';

module.exports = app => {
  const index = (req, res) => {
    res.status(200).json('ok');
  };

  return {
    index,
  };
};
