const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const aes = require('../helpers/aes.cipher');
const userService = require('./user.service');
const LoginToken = require('../models/login-token');

const authService = {

    login: async function ({ username, password }) {
        const user = await userService.getByUsername(username);
        const serverToken = await this.getServerLoginToken(username);

        const [passwordHash, clientToken] = password.split("::");

        if (user && serverToken && passwordHash && clientToken) {
            const dbPasswordHash = aes.decrypt(user.password);
            user.password = undefined;

            if (this.isPasswordCorrect(passwordHash, dbPasswordHash, serverToken, clientToken)) {
                return jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: "12h" });
            }
        }
    },

    authorize: function (roles = []) {
        // roles param can be a single role string (e.g. Role.User or 'User') 
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        if (typeof roles === 'number') {
            roles = [roles];
        }

        return [
            // authenticate JWT token and attach user to request object (req.user)
            expressJwt({ secret: process.env.JWT_SECRET }),

            // authorize based on user role
            async (req, res, next) => {
                const user = await userService.getForAuth(req.user._id);

                if (!user || user.role != req.user.role) {
                    return res.status(401).json({
                        id: "invalid_token",
                        message: 'Invalid Token'
                    });
                }

                if (roles.length && !roles.includes(user.role)) {
                    // user's role is not authorized
                    return res.status(401).json({
                        id: "unauthorized",
                        message: 'Unauthorized'
                    });
                }

                // authentication and authorization successful
                next();
            }
        ];
    },

    isPasswordCorrect: function (passwordHash, dbPasswordHash, serverToken = "", clientToken = "") {
        const hash = crypto.createHash("sha256");
        hash.update(clientToken + dbPasswordHash + serverToken);
        const currentHash = hash.digest("hex");
        return currentHash === passwordHash;
    },

    createServerLoginToken: function (username) {
        let serverToken = new LoginToken({ username });
        serverToken.save();

        return serverToken.token;
    },

    getServerLoginToken: async function (username) {
        let serverToken = await LoginToken.findOne({ username });
        if (serverToken) {
            let token = serverToken.token;

            await LoginToken.deleteOne({ _id: serverToken._id });

            if (serverToken.expirationTime < Date.now()) {
                return;
            }

            return token;
        }
    }
}

module.exports = authService;