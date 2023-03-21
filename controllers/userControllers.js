const Users = require('../model/userModel');
const Roles = require('../model/roleModel');
const { encrypt, decrypt } = require('../services/secure');
const jwt = require('jsonwebtoken');
const { isAdmin } = require('../services/adminChecker');
const { userRoles } = require('../model/enumUser');

async function userRegister(req, res) {
    try {
        const validData = await req.body;
        console.log(req.body);
        const userExist = await Users.find({ email: validData.email, isDeleted: false });
        if (userExist.length) {
            throw new Error('403-User already Exist');
        }
        else {
            const roles = await Roles.findOne({ role: userRoles.USER });
            const user = new Users();
            user.fullName = validData.fullname;
            user.userName = validData.username;
            user.email = validData.email;
            user.password = validData.password;
            user.role = roles._id;
            const saved = await user.save();
            if (!saved) {
                throw new Error('500-Error while writing data to database');
            }
            else {
                res.status(200).json({
                    status: 200,
                    message: "OK",
                    data: {
                        firstname: saved.fullName,
                        username: saved.userName,
                        email: saved.email
                    }
                })
            }
        }
    }
    catch (error) {
        if (error.isJoi == true) {
            res.status(400).json({
                status: 400,
                message: error.message
            })
        } else {
            if (error instanceof TypeError) {
                console.log(error);
            }
            else {
                const [stauts, message] = error.message.split('-');
                res.status(Number(stauts)).json({
                    status: Number(stauts),
                    message: message
                })
            }
        }
    }
}

async function userLogin(req, res) {
    try {
        if (req.cookies.token) {
            throw new Error('401-Alreadey Logged in')
        } else {
            const validData = await req.body;
            const user = await Users.findOne({ email: validData.email, isDeleted: false });
            if (!user) {
                throw new Error('404-User not found');
            }
            else {
                if (validData.password != user.password) {
                    throw new Error('401-Password Didn\'t mactch');
                }
                else {
                    const payload = {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                    }
                    const route = await isAdmin(user.role) ? '/admin/' : 'posts/all-post'
                    const token = jwt.sign(payload, process.env.TOKEN_SECERET);
                    res.cookie('token', token);
                    res.status(200).json({
                        status: 200,
                        route: route,
                        token: token
                    })
                }
            }
        }
    } catch (error) {
        if (error.isJoi == true) {
            res.status(422).json({
                status: 422,
                message: error.message
            })
        } else {
            if (error instanceof TypeError) {
                console.log(error);
            }
            else {
                const [stauts, message] = error.message.split('-');
                res.status(Number(stauts)).json({
                    status: Number(stauts),
                    message: message
                })
            }
        }
    }
}

async function userProfile(req, res) {
    try {
        const response = {
            id: req.user._id,
            fullname: req.user.fullName,
            username: req.user.userName,
            email: req.user.email,
        }
        res.render('profile', {
            response: response
        })
    } catch (error) {
        res.send(error);
    }
}

async function updateUser(req, res) {
    try {
        let id = req.user._id;
        const validData = req.body;
        const user = await Users.findOne({ _id: id, isDeleted: false });
        if (!user) {
            throw new Error('404-User not found');
        }
        else {
            let updatedfullname = validData.fullname ?? user.fullName;
            let updatedusername = validData.username ?? user.userName;
            let updatedemail = validData.email ?? user.email;

            const updatedData = await Users.updateOne({ _id: id, isDeleted: false }, {
                $set: {
                    fullName: updatedfullname,
                    userName: updatedusername,
                    email: updatedemail
                }
            })
            if (!updatedData) {
                throw new Error('500-Error while updating data')
            }
            else {
                const route = await isAdmin(user.role) ? '/admin/' : '/posts/all-post';
                res.status(200).json({
                    status: 200,
                    route: route
                })
            }

        }


    } catch (error) {
        if (error.isJoi == true) {
            res.status(422).json({
                message: error.message
            })
        }
        if (error instanceof TypeError) {
            console.log(error);
        }
        let [status, message] = error.message.split('-');
        res.status(Number(status)).json({
            message: message
        })
    }
}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.clearCookie('isLoggedIn');
    res.redirect('/posts');
}

async function updatePasswordPage(req, res) {
    res.render('updatePassword');
}

async function updatePassword(req, res) {
    try {
        const id = req.user._id;
        const validData = req.body;

        const user = await Users.findOne({ _id: id, isDeleted: false });
        if (!user) {
            throw new Error('404-User not found');
        }
        else {
            if (user.password == validData.oldpassword) {
                const updatedData = await Users.updateOne({ _id: id, isDeleted: false }, {
                    $set: {
                        password: encrypt(validData.newpassword)
                    }
                })
                if (!updatedData) {
                    throw new Error('500-Error while updating data')
                }
                else {
                    const route = await isAdmin(user.role) ? '/admin/' : '/posts/all-post';
                    res.status(200).json({
                        status: 200,
                        route: route
                    })
                }
            }
            else {
                throw new Error('409-Passowrd Didn\'t match');
            }
        }


    } catch (error) {
        if (error.isJoi == true) {
            res.status(422).json({
                message: error.message
            })
        }
        if (error instanceof TypeError) {
            console.log(error);
        }
        let [status, message] = error.message.split('-');
        res.status(Number(status)).json({
            message: message
        })
    }
}

module.exports = { userRegister, userLogin, userProfile, updateUser, logoutUser, updatePasswordPage, updatePassword }