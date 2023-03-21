const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    comment: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const postSchema = mongoose.Schema({
    postTitle: {
        type: String,
        default: null
    },
    postImage: {
        type: String,
        default: null
    },
    postContent: {
        type: String,
        default: null
    },
    postAuthor: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    postComments: [{
        type: commentSchema,
        default: null,
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model("Posts", postSchema);