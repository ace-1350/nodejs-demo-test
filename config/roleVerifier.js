const passport = require("passport")
const Roles = require('../model/roleModel')

exports.authorize = (roles = []) => (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if(err) return next(res.sendStatus(401));
        if(!user) return next(res.sendStatus(401));

        if (!roles.length) {
            req.user = user;
            return next(null);
          } else {
            const { role } = await Roles.findOne({ _id: user.role }, { role: 1 });
            if (roles.includes(role)) {
              req.user = user;

              // req.user.isAdmin = true
              
              return next(null);
            } else {
              return next(res.sendStatus(401));
            }
          }
    })(req, res, next);
}