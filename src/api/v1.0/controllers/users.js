const jwt = require('jsonwebtoken');
const User = require('../../../database/models/Users');

const userCtrl = {};

userCtrl.signUp = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            if (user)
                return reject({
                    message: 'This email is already registered',
                    code: 409,
                });

            if (password.length < 2)
                return reject({ message: 'Passord too short', code: 400 });
            const newUser = new User({
                email,
                password: '',
            });
            newUser.password = await newUser.encryptPassword(password);
            newUser
                .save()
                .then(() => {
                    resolve({
                        message: 'Saved user',
                    });
                })
                .catch(() => {
                    reject({ message: 'Failed to write database', code: 500 });
                });
        } catch (e) {
            reject({ message: `Error ${e}`, code: 500 });
        }
    });
};

userCtrl.logIn = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return reject({ message: 'User not found', code: 400 });
            const match = await user.matchPassword(password);
            if (!match) return reject({ message: 'Wrong password', code: 403 });

            const payLoad = { id: user._id };
            const accessToken = jwt.sign(
                payLoad,
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m' }
            );
            const refreshToken = jwt.sign(
                payLoad,
                process.env.REFRESH_TOKEN_SECRET
            );
            user.tokens.push(refreshToken);

            user.save()
                .then(() => {
                    resolve({
                        login: true,
                        accessToken,
                        refreshToken,
                        user_id: user._id,
                    });
                })
                .catch(() => {
                    reject({ message: 'Failed to write database', code: 400 });
                });
        } catch (e) {
            reject({ message: `Error ${e}`, code: 500 });
        }
    });
};

userCtrl.logOut = (id, refreshToken) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findById(id);
            if (!user) return reject({ message: 'User not found', code: 400 });

            const { tokens } = user;
            const index = tokens.indexOf(refreshToken);
            if (index < 0)
                return reject({ message: 'Failed token to logout', code: 400 });

            tokens.splice(index, 1);
            user.tokens = tokens;
            user.save()
                .then(() => {
                    resolve({
                        message: 'Close session successfully',
                    });
                })
                .catch(() => {
                    reject({ message: 'Failed to write database', code: 400 });
                });
        } catch (e) {
            reject({ message: `Error ${e}`, code: 500 });
        }
    });
};

module.exports = userCtrl;