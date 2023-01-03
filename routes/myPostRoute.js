const express = require('express')
const authenticate = require('../middleweres/authenticate')
const postController = require('../controllers/postController')
const upload = require('../middleweres/upload')
const router = express.Router();

router.get('/', authenticate, postController.getMyPost)
router.put('/:id',authenticate,upload.single('postImg'), postController.updateMyPost)
router.delete('/:id', authenticate, postController.deletePost)


module.exports = router;