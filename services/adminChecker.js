const Roles = require('../model/roleModel');
const Users = require('../model/userModel');
const { userRoles } = require('../model/enumUser');

async function isAdmin(user) {
    try {
        const roles = await Roles.find({ $or: [{ role: userRoles.ADMIN }, { role: userRoles.SUPER }] });
        if (!roles) {
            throw new Error('Connot Find the role');
        }
        else {
            let flag = false
            await roles.forEach((role) => {
                if (String(user) == String(role._id)) {
                    flag = true;
                }
            })
            return flag;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { isAdmin }; 