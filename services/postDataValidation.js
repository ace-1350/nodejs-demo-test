const joi = require('joi');

const postDataValidator = {
    body: joi.object({
        posttitle: joi.string().max(15).required(),
        postcontent: joi.string().max(250).required(),
    }).unknown(true)
}

const postCommentValidator = {
    body: joi.object({
        postid: joi.string().regex(RegExp(/^[0-9a-fA-F]{24}$/)).required(),
        comment: joi.string().required()
    })
}

const postCommentRemoveValidator = {
    body: joi.object({
        postid: joi.string().regex(RegExp(/^[0-9a-fA-F]{24}$/)).required(),
        id: joi.string().regex(RegExp(/^[0-9a-fA-F]{24}$/)).required()
    })
}

const idValidator = {
    query: joi.object({
        id: joi.string().regex(RegExp(/^[0-9a-fA-F]{24}$/)).required()
    })
}

module.exports = { postDataValidator, postCommentValidator, postCommentRemoveValidator, idValidator };