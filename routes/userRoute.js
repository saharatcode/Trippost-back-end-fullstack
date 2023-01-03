const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const authenticate = require('../middleweres/authenticate')
const upload = require('../middleweres/upload')

const router = express.Router()

router.get('/:id',authenticate,userController.getUser)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.patch('/profile-img', authenticate, upload.single('profileImg'), userController.updateProfileImg)
router.patch('/new-user-name', authenticate, userController.updateUserName)

module.exports = router;