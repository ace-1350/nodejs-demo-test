const express = require('express');
const router = express.Router();
const { upload } = require('../services/multer');
const { userRegister, userLogin, userProfile, updateUser, logoutUser, updatePasswordPage, updatePassword } = require('../controllers/userControllers');
const { authorize } = require('../config/roleVerifier');
const { userDataValidator, userLoginDataValidator, userDataUpdateValidator, userPasswordValidator } = require('../services/userDataValidation');
const { validate } = require('express-validation');

router.use(express.json());

router.post('/sign-up', upload.single(), validate(userDataValidator), userRegister)
router.post('/sign-in', upload.single(), validate(userLoginDataValidator), userLogin)
router.get('/profile', authorize(), upload.single(), userProfile)
router.put('/update', authorize(), upload.single(), validate(userDataUpdateValidator), updateUser)
router.get('/logout', authorize(), logoutUser)
router.get('/update-password', authorize(), updatePasswordPage)
router.put('/update-password', authorize(), upload.single(), validate(userPasswordValidator), updatePassword)

module.exports = router;