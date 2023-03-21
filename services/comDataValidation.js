/*

*************************************************************
*************************************************************
****                                                     ****
****                                                     ****
****                                                     ****
****            Not required Deperecated                 ****
****                                                     ****
****                                                     ****
****                                                     ****
****                                                     ****
*************************************************************
*************************************************************
*/



const joi = require('joi');

const commDataValidator = joi.object({
    postid: joi.string().required(),
    comment: joi.string().max(50).required(),
})

module.exports = { commDataValidator };