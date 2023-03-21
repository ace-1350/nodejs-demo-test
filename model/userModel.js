const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../services/secure');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        default: null,
    },
    userName: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Roles'
    },
    isDeleted: {
        type: Boolean,
        default: 0
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

userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await encrypt(this.password);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.post('find', function find(doc){
    try{
        doc = doc.filter((item) => {
            decrypt(item.password)
            return item;
        });
    }
    catch(error){
        console.log(error);
    }
})

userSchema.post('findOne', function find(doc){
    try{
        doc.password = decrypt(doc.password);
    }
    catch(error){
        console.log(error);
    }
})

module.exports = mongoose.model("Users", userSchema);