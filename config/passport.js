require('dotenv').config();
const passport = require('passport');
const Users = require('../model/userModel');
const jwtStrategy = require('passport-jwt').Strategy;

function initializePassport() {
    function cookieExtractor(req) {
        let jwt = null

        if (req && req.cookies) {
            jwt = req.cookies['token']
        }

        return jwt
    }
    const options = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.TOKEN_SECERET
    }
    passport.use(new jwtStrategy(options, async (jwt_payload, done) => {
        let user = await Users.findOne({ _id: jwt_payload.id })
        if (!user) {
            done(null, false);
        }
        else {
            done(null, user);
        }
    }))
}

module.exports = { initializePassport }