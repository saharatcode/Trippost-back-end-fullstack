const express = require('express')
const authenticate = require('../middleweres/authenticate')
const commentController = require('../controllers/commentController')
const router = express.Router();

router.post('/', authenticate, commentController.createComment)
router.put('/:id', authenticate, commentController.updateComment)
router.delete('/:id', authenticate, commentController.deleteComment)

module.exports = router;