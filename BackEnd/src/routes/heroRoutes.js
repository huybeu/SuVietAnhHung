const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const authenticate = require('../middlewares/authenticate');

// Public routes
router.get('/', heroController.list);
router.get('/slug/:slug', heroController.getBySlug);
router.get('/:id', heroController.getById);

// Protected routes
router.use(authenticate);
router.post('/', heroController.create);
router.patch('/reorder', heroController.reorder);
router.patch('/:id/featured', heroController.toggleFeatured);
router.patch('/:id', heroController.update);
router.delete('/:id', heroController.remove);

module.exports = router;
