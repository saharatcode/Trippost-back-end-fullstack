const express = require('express')
const authenticate = require('../middleweres/authenticate')
const postController = require('../controllers/postController')
const upload = require('../middleweres/upload')

const router = express.Router();

router.get('/',authenticate, postController.getPost)
//Only person
router.get('/:id',authenticate, postController.getWriterPost)
router.post('/', authenticate, upload.single('postImg'), postController.createPost)
router.put('/:id',authenticate,upload.single('postImg'), postController.updatePost)
router.delete('/:id', authenticate, postController.deletePost)

module.exports = router;