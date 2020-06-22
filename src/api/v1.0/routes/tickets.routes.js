const { Router } = require('express');
const response = require('./helpers/response');
const ticketCtrl = require('../controllers/tickets');
const auth = require('./helpers/auth');

const router = Router();

router.post('/newTicket', auth, (req, res) => {
    try {
        ticketCtrl
            .newTicket(res.locals.user)
            .then(info => {
                response.success(res, info, 200);
            })
            .catch(e => {
                response.error(res, e, 400);
            });
    } catch (e) {
        response.error(res, e, 500);
    }
});

module.exports = router;
