const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authenticate = require('../middlewares/authenticate');

router.get('/', tagController.list);

router.use(authenticate);
router.post('/', tagController.create);
router.delete('/:id', tagController.remove);

module.exports = router;
