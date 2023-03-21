const Posts = require('../model/postModel');
const Roles = require('../model/roleModel');
const { userRoles } = require('../model/enumUser');
const { isAdmin } = require('../services/adminChecker');
const { postDataValidator, postCommentValidator, postCommentRemoveValidator } = require('../services/postDataValidation');
const moment = require('moment/moment');

async function displayPost(req, res) {
    let response = {};
    try {
        const postData = await Posts.find({ isDeleted: false }).populate('postAuthor');
        response.postdata = postData;
        res.render('posts', {
            response: response
        })
    } catch (error) {
        console.log(error);
    }
}

async function displayPostLoggedIn(req, res) {
    let response = {};
    try {
        const postData = await Posts.find({ isDeleted: false }).populate('postAuthor');
        response.postdata = postData;
        res.render('postsLoggedin', {
            response: response
        })
    } catch (error) {
        console.log(error);
    }
}

function displayRegisterPage(req, res) {
    res.render('registerPostPage');
}

async function registerPost(req, res) {
    try {
        const validData = req.body;
        const post = new Posts();
        post.postTitle = validData.posttitle;
        post.postImage = req.file.filename;
        post.postContent = validData.postcontent;
        post.postAuthor = req.user.id;

        const saved = await post.save();
        if (!saved) {
            throw new Error('500-Error while writing data to database');
        }
        else {
            const route = await isAdmin(req.user.role) ? '/admin/' : '/posts/all-post'
            res.status(200).json({
                status: 200,
                message: "OK",
                route: route,
                data: {
                    posttitle: saved.postTitle,
                    postimage: saved.postImage,
                    postcontent: saved.postContent,
                    postauthor: saved.postAuthor
                }
            })
        }
    } catch (error) {
        if (error.isJoi == true) {
            res.status(422).json({
                status: 422,
                errorMessage: error.message
            })
        } else {
            if (error instanceof TypeError) {
                console.log(error);
            }
            const [stauts, errorMessage] = error.message.split('-');
            res.status(Number(stauts)).json({
                status: Number(stauts),
                errorMessage: errorMessage
            })
        }
    }
}

async function singlePost(req, res) {
    try {
        const id = req.query.id;
        const postData = await Posts.findOne({ _id: id, isDeleted: false }).populate('postAuthor').populate('postComments.authorId');
        postData.date = moment(postData.createdAt, 'YYYY-MM-DD').format("dddd, Do MMMM");
        postData.postComments = postData.postComments.filter((item) => {
            if (!item.isDeleted){
                item.date = moment(item.createdAt, 'YYYY-MM-DD').fromNow();
                return item;
            }
        })
        if (!postData) {
            throw new Error("Post not found")
        }
        else {
            res.render('single-post', {
                postData: postData,
            });
        }
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

async function addComment(req, res) {
    try {
        const validData = req.body;
        const id = validData.postid;
        const post = await Posts.findOne({ _id: id, isDeleted: false });
        if (!post) {
            throw new Error("500-Can't find the post");
        }
        else {
            const commentData = {
                comment: validData.comment,
                authorId: req.user._id,
                isDeleted: false
            }
            const updatePost = await Posts.updateOne({ _id: id, isDeleted: false }, {
                $push: {
                    'postComments': commentData
                }
            })
            if (!updatePost) {
                throw new Error('500-Error While updating');
            }
            else {
                res.sendStatus(200);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteComment(req, res) {
    try {
        const validData = req.body;
        const postId = validData.postid;
        const commId = validData.id;
        const post = await Posts.findOne({ _id: postId, isDeleted: false });

        if (!post) {
            throw new Error('404-Connot find the post');
        }
        else {
            const comment = await Posts.findOne({ _id: postId, "postComments._id": commId, isDeleted: false });
            if (!comment) {
                throw new Error('404-Cannot find the comment ')
            }
            else {
                let canUpdate = false;
                if (await isAdmin(req.user.role)) { //check admin
                    canUpdate = true;
                } else if (String(req.user._id) == String(comment.postAuthor._id)) { // check owner
                    canUpdate = true;
                } else {
                    const comm = comment.postComments.filter((item) => {
                        if (String(req.user._id) == String(item.authorId) && String(item._id) == String(commId)) {
                            return item;
                        }
                    }) // check comment owner
                    if (Object.entries(comm).length) {
                        canUpdate = true;
                    }
                    else {
                        canUpdate = false;
                    }
                }

                if (canUpdate) {
                    const updatePost = await Posts.updateOne({ "_id": postId, "postComments._id": commId, 'isDeleted': false }, {
                        $set: {
                            'postComments.$.isDeleted': true,
                            'postComments.$.deletedBy': req.user.id,
                            'postComments.$.deletedAt': Date.now()
                        }
                    })
                    if (!updatePost) {
                        throw new Error('500-Error While Removing');
                    }
                    else {
                        res.sendStatus(200);
                    }
                } else {
                    throw new Error('401-Cannot delete')
                }
            }
        }

    } catch (error) {
        if (error instanceof TypeError) {
            console.log(error);
        }
        const [status, message] = error.message.split('-');
        res.status(Number(status)).json({ message });
    }
}

async function myPost(req, res) {
    try {
        const userId = req.user._id;
        const userPosts = await Posts.find({ 'postAuthor': userId, isDeleted: false }).populate('postAuthor');

        if (!userPosts) {
            throw new Error('404-No Posts Available');
        }
        else {
            res.render('myPosts', {
                data: userPosts,
                user: userId
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function editPostPage(req, res) {
    try {
        const postId = req.query.id;
        const post = await Posts.findOne({ _id: postId, isDeleted: false });
        if (!post) {
            throw new Error('404-Post Not Found');
        }
        else {
            res.render('editPostPage', {
                data: post
            });
        }

    } catch (error) {
        console.log(error);
    }
}

async function editPost(req, res) {
    try {
        const validData = await postDataValidator.validateAsync(req.body);
        const post = await Posts.findOne({ _id: validData.postId, isDeleted: false });
        if (!post) {
            throw new Error('404-Post Not Found');
        } else {
            let { postTitle, postImage, postContent } = post;
            let newPostTitle, newPostImage, newPostContent;

            newPostTitle = validData.posttitle ?? postTitle
            newPostImage = req?.file?.filename ?? postImage
            newPostContent = validData.postcontent ?? postContent

            const updateData = await Posts.updateOne({ _id: validData.postId, isDeleted: false }, {
                $set: {
                    postTitle: newPostTitle,
                    postImage: newPostImage,
                    postContent: newPostContent
                }
            })
            if (!updateData) {
                throw new Error('500-Error while updating data');
            }
            else {
                const route = await isAdmin(req.user.role) ? '/admin/' : '/posts/all-post';
                res.status(200).json({
                    route: route
                });
            }
        }
    } catch (error) {
        if (error.isJoi = true) {
            res.status(422).json({
                message: error.message
            });
        }
        else {
            if (error instanceof TypeError) {
                console.log(error);
            }
            const [status, message] = error.message.split('');
            res.status(Number(status)).json({
                message: message
            });
        }
    }
}

async function deletePost(req, res) {a
    try {
        const id = req.query.id;
        const post = await Posts.findOne({ _id: id, isDeleted: false });
        if (!post) {
            throw new Error('404-Cannot Get Post');
        }
        else {
            if (await isAdmin(req.user.role) || String(req.user._id) == String(post.postAuthor._id)) {
                const removeData = await Posts.updateOne({ _id: id, isDeleted: false }, {
                    $set: {
                        'isDeleted': true,
                        'deletedBy': req.user._id,
                        'deletedAt': Date.now()
                    }
                })
                if (!removeData) {
                    throw new Error('500-Error While Deleting Post');
                }
                else {
                    if (await isAdmin(req.user.role)) {
                        res.redirect(`/admin/`);
                    } else {
                        res.redirect(`/posts/my-post`);
                    }
                }
            }
            else {
                throw new Error('401-Unauthorized Access');
            }

        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { displayPost, displayRegisterPage, registerPost, singlePost, addComment, deleteComment, displayPostLoggedIn, myPost, editPostPage, editPost, deletePost };