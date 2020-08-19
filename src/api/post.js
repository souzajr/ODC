'use strict';

module.exports = app => {
  const index = (req, res) => {
    console.log(req.params);
    res.status(200).json('ok');
  };

  return {
    index,
  };
};
