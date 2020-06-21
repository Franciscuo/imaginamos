const jwt = require('jsonwebtoken');
const User = require('../../../database/models/Users');

const userCtrl = {};



userCtrl.signUp = (email, password, type) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            if (user) return reject('This email is already registered');
            const newUser = new User({
                email,
                type,
                password: ''
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save()
                .then(() => {
                    resolve('Saved user');
                })
                .catch(e => {
                    reject('Failed to write database');
                })
        } catch (e) {
            reject(`Error ${e}`);
        }
    })
};



userCtrl.logIn = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return reject('User not found');
            const match = await user.matchPassword(password);
            if (!match) return reject('Wrong password');

            const payLoad = { id: user._id }
            const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payLoad, process.env.REFRESH_TOKEN_SECRET);
            user.tokens.push(refreshToken);

            await user.save()
                .then((items) => {
                    resolve({
                        login: true,
                        accessToken,
                        refreshToken,
                        user_id: user._id,
                    });
                })
                .catch(e => {
                    reject('Failed to write database');
                })
        } catch (e) {
            console.log(e)
            reject(`Error ${e}`);
        }
    })

}


userCtrl.logOut = (id, refreshToken) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findById(id);
            if (!user) return reject('User not found');
            const tokens = user.tokens;
            const index = tokens.indexOf(refreshToken);
            (index > -1) ? tokens.splice(index, 1): reject('Failed to logout');;
            user.tokens = tokens;
            await user.save()
                .then((items) => {
                    resolve('Close session successfully');
                })
                .catch(e => {
                    reject('Failed to write database');
                })
        } catch (e) {
            reject(`Error ${e}`);
        }
    })
}



module.exports = userCtrl;