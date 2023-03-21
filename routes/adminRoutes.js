const router = require('express').Router();
const { authorize } = require('../config/roleVerifier');
const { upload } = require('../services/multer');
const { userRoles } = require('../model/enumUser');
const { adminPage, adminSinglePage, allUsers, allAdmins, makeAdmin, removeUser, makeUser } = require('../controllers/adminController');

router.get('/', authorize([userRoles.ADMIN, userRoles.SUPER]), adminPage)
router.get('/single-post', authorize([userRoles.ADMIN, userRoles.SUPER]), adminSinglePage)
router.get('/all-user', authorize([userRoles.ADMIN, userRoles.SUPER]), allUsers)
router.get('/all-admin', authorize([userRoles.ADMIN, userRoles.SUPER]), allAdmins)
router.put('/makeAdmin', authorize([userRoles.SUPER]), upload.single(), makeAdmin)
router.put('/makeUser', authorize([userRoles.SUPER]), upload.single(), makeUser)
router.put('/removeUser', authorize([userRoles.SUPER]), upload.single(), removeUser)

module.exports = router;