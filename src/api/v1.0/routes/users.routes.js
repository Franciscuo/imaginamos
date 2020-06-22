const { Router } = require('express');

const router = Router();
const response = require('./helpers/response');
const userCtrl = require('../controllers/users');

router.post('/signup', (req, res) => {
    try {
        const { email, password } = req.body.data;
        userCtrl
            .signUp(email, password)
            .then(info => {
                response.success(res, info, 201);
            })
            .catch(e => {
                response.error(res, e.message, e.code);
            });
    } catch (e) {
        response.error(res, e, 500);
    }
});

router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body.data;
        userCtrl
            .logIn(email, password)
            .then(info => {
                response.success(res, info, 200);
            })
            .catch(e => {
                response.error(res, e.message, e.code);
            });
    } catch (e) {
        response.error(res, e, 500);
    }
});

router.post('/logout', (req, res) => {
    try {
        const refreshToken = req.headers.authorization;
        const { id } = req.body.data;
        userCtrl
            .logOut(id, refreshToken)
            .then(info => {
                response.success(res, info, 200);
            })
            .catch(e => {
                response.error(res, e.message, e.code);
            });
    } catch (e) {
        response.error(res, e, 500);
    }
});

module.exports = router;
