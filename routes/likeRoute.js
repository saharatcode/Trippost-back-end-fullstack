const express = require('express')
const authenticate = require('../middleweres/authenticate')
const likeController = require('../controllers/likeController')
const router = express.Router();

router.get('/:id', authenticate, likeController.getWriterLike)
router.post('/', authenticate, likeController.createLike)
router.delete('/:id', authenticate, likeController.deleteLike)


module.exports = router;