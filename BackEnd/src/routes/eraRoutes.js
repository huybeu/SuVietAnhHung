const express = require('express');
const router = express.Router();
const eraController = require('../controllers/eraController');

router.get('/', eraController.list);
router.get('/:id', eraController.getById);

module.exports = router;
