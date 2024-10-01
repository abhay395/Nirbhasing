const passport = require("passport");

exports.cookieExtractor = function(req) {
    if (req && req.cookies) {
       return token =req.cookies.jwt
    }
};
exports.isAuth = (req, res, next) => {
    return passport.authenticate('jwt')
   };