'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('restful api version 1');
});

require('../../controllers/login')(router);
require('../../controllers/users')(router);

module.exports = router;