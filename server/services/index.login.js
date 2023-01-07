'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
var secret = '123456';

function createToken (user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };

    return jwt.encode(payload, secret);
};

function decodeToken (token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, secret);

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'El token ha expirado'
                });
            };

            resolve(payload.sub);

        } catch (err) {
            reject({
                status: 500,
                message: 'Invalid Token'
            });
        };
    });

    return decoded;
};

module.exports = {
    createToken,
    decodeToken
}