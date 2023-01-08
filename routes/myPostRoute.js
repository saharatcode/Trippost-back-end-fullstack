const express = require('express')
const authenticate = require('../middleweres/authenticate')
const postController = require('../controllers/postController')
const router = express.Router();

router.get('/', authenticate, postController.getMyPost)


module.exports = router;