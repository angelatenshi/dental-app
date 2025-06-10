const express = require('express');
const router = express.Router();
const { getDentists } = require('../controllers/dentistController');

router.get('/', getDentists);

module.exports = router;