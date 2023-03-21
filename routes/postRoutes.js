const express = require('express');
const router = express.Router();
const { upload } = require('../services/multer');
const { displayPost, displayRegisterPage, registerPost, singlePost, addComment, deleteComment, displayPostLoggedIn, myPost, editPostPage, editPost, deletePost } = require('../controllers/postControllers');
const { authorize } = require('../config/roleVerifier');
const userModel = require('../model/userModel');
const { postDataValidator, postCommentValidator, postCommentRemoveValidator, idValidator } = require('../services/postDataValidation');
const { validate } = require('express-validation');

router.get('/', displayPost);
router.get('/all-post', displayPostLoggedIn);
router.get('/register', displayRegisterPage);
router.get('/single-post', validate(idValidator), singlePost)
router.post('/register', authorize(), upload.single('postimage'), validate(postDataValidator), registerPost);
router.put('/add-comment', authorize(), upload.single(), validate(postCommentValidator), addComment);
router.delete('/remove-comment', authorize(), upload.single(), validate(postCommentRemoveValidator), deleteComment);
router.get('/my-post', authorize(), myPost);
router.get('/edit-post-page', authorize(), validate(idValidator), editPostPage);
router.put('/edit-post', authorize(), upload.single('postimage'), validate(postDataValidator), editPost);
router.get('/delete-post', authorize(), validate(idValidator), deletePost);

module.exports = router;