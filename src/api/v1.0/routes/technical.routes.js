const { Router } = require('express');

const router = Router();
const response = require('./helpers/response');
const technicalCtrl = require('../controllers/technical');

router.post('/addTechnical', (req, res) => {
    try {
        const { email } = req.body.data;
        technicalCtrl
            .addTechnical(email)
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

module.exports = router;