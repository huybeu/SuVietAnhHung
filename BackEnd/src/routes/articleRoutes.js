const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authenticate = require('../middlewares/authenticate');

// Public routes
router.get('/', articleController.list);
router.get('/slug/:slug', articleController.getBySlug);
router.get('/:id', articleController.getById);

// Protected routes
router.use(authenticate);
router.post('/', articleController.create);
router.patch('/:id/featured', articleController.toggleFeatured);
router.patch('/:id', articleController.update);
router.delete('/:id', articleController.remove);

module.exports = router;
