const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Role } = require('../models');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    console.log(user,err, info, "user dtaa ========================================================================");
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!"));
    }

    req.user = user;

    resolve();
};

/**
 * Auth middleware.
 * @returns
 */
exports.auth =
    () =>
    async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, resolve, reject)
            )(req, res, next);
        })
            .then(() => next())
            .catch((err) => next(err));
    };
