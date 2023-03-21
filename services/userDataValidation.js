const joi = require('joi');

const userDataValidator = {
    body: joi.object({
        fullname: joi.string().min(6).max(30).required(),
        username: joi.string().pattern(RegExp(/^[a-zA-Z0-9._]{4,15}$/)).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/).required(),
        confirmPassword: joi.ref('password')
    }).required()
}

const userLoginDataValidator = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/),
    })
}

const userDataUpdateValidator = {
    body: joi.object({
        fullname: joi.string().min(6).max(30),
        username: joi.string().pattern(RegExp(/^[a-zA-Z0-9._]{4,15}$/)),
        email: joi.string().email()
    })
}

const userPasswordValidator = {
    body: joi.object({
        oldpassword: joi.string().pattern(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/),
        newpassword: joi.string().pattern(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/),
        confirmPassword: joi.ref('newpassword')
    })
}

module.exports = { userDataValidator, userLoginDataValidator, userDataUpdateValidator, userPasswordValidator }