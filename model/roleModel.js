const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    role: {
        type: String
    }
})

module.exports = mongoose.model('Roles', roleSchema);