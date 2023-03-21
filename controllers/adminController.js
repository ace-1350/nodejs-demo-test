const Posts = require('../model/postModel');
const Users = require('../model/userModel');
const Roles = require('../model/roleModel');
const { userRoles } = require('../model/enumUser');
const moment = require('moment/moment');

async function adminPage(req, res) {
    try {
        let response = {};
        const postData = await Posts.find({ isDeleted: false }).populate('postAuthor');

        response.isLoggedIn = false;
        if (req.cookies?.token) {
            response.isLoggedIn = true;
        };
        response.postdata = postData;
        res.render('adminPage', {
            response: response
        })
    } catch (error) {
        console.log(error);
        res.redirect('/admin/');
    }
}

async function adminSinglePage(req, res) {
    try {
        const id = req.query.id;
        const postData = await Posts.findOne({ _id: id, isDeleted: false }).populate('postAuthor').populate('postComments.authorId');
        postData.date = moment(postData.createdAt, 'YYYY-MM-DD').format("dddd, Do MMMM");
        postData.postComments = postData.postComments.filter((item) => {
            if (!item.isDeleted) {
                item.date = moment(item.createdAt, 'YYYY-MM-DD').fromNow();
                return item;
            }
        })
        if (!postData) {
            throw new Error("Post not found")
        }
        else {
            res.render('adminSinglePost', {
                postData: postData,
            });
        }
    } catch (err) {
        console.log(err);
    }
}

async function allUsers(req, res) {
    try {
        let response = {};
        const role = await Roles.findOne({ role: userRoles.USER })
        const users = await Users.find({ role: role._id, isDeleted: false }).populate('role');
        response.isLoggedIn = false;
        if (req.cookies?.token) {
            response.isLoggedIn = true;
        };
        if (!users) {
            throw new Error('500-Cannot Fetch Data From Database')
        }
        else {
            response.data = users
            res.render('adminAllUsersPage', {
                response: response
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function allAdmins(req, res) {
    try {
        let response = {};
        const role = await Roles.findOne({ role: userRoles.ADMIN })
        const users = await Users.find({ role: role._id, isDeleted: false }).populate('role');
        response.isLoggedIn = false;
        if (req.cookies?.token) {
            response.isLoggedIn = true;
        };
        if (!users) {
            throw new Error('500-Cannot Fetch Data From Database')
        }
        else {
            response.data = users
            res.render('showOnlyAdmins', {
                response: response
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function makeAdmin(req, res) {
    try {
        const id = req.body.id;
        const user = await Users.findOne({ _id: id, isDeleted: false }).populate('role');
        const role = await Roles.findOne({ role: userRoles.ADMIN }, { _id: 1 });
        if (!user) {
            throw new Error('404-No Data Found')
        } else {
            const update = await Users.updateOne({ _id: user._id, isDeleted: false }, {
                $set: {
                    "role": role._id
                }
            })
            if (!update) {
                throw new Error('500-Error While Updating Data');
            } else {
                res.sendStatus(200);
            }
        }

    } catch (error) {
        if (error instanceof TypeError) {
            console.log(error);
        }
        const [statusCode, message] = error.message.split('-');
        res.status(Number(statusCode)).json({
            message: message
        })
    }
}

async function removeUser(req, res) {
    try {
        const id = req.body.id;
        const user = await Users.findOne({ _id: id, isDeleted: false }).populate('role');
        if (!user) {
            throw new Error('404-No Data Found')
        } else {
            const update = await Users.updateOne({ _id: user._id }, {
                $set: {
                    "isDeleted": true,
                    "deletedBy": req.user._id,
                    "deletedAt": Date.now()
                }
            })
            if (!update) {
                throw new Error('500-Error While Updating Data');
            } else {
                res.sendStatus(200);
            }
        }

    } catch (error) {
        if (error instanceof TypeError) {
            console.log(error);
        }
        const [statusCode, message] = error.message.split('-');
        res.status(Number(statusCode)).json({
            message: message
        })
    }
}

async function makeUser(req, res) {
    try {
        const id = req.body.id;
        const user = await Users.findOne({ _id: id, isDeleted: false }).populate('role');
        const role = await Roles.findOne({ role: userRoles.USER }, { _id: 1 });
        if (!user) {
            throw new Error('404-No Data Found')
        } else {
            const update = await Users.updateOne({ _id: user._id, isDeleted: false }, {
                $set: {
                    "role": role._id
                }
            })
            if (!update) {
                throw new Error('500-Error While Updating Data');
            } else {
                res.sendStatus(200);
            }
        }

    } catch (error) {
        if (error instanceof TypeError) {
            console.log(error);
        }
        const [statusCode, message] = error.message.split('-');
        res.status(Number(statusCode)).json({
            message: message
        })
    }
}

module.exports = { adminPage, adminSinglePage, allUsers, allAdmins, makeAdmin, removeUser, makeUser }