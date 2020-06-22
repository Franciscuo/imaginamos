const jwt = require('jsonwebtoken');
const Ticket = require('../../../database/models/Tickets');
const Technical = require('../../../database/models/Technical');

const ticketCtrl = {};

ticketCtrl.newTicket = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            const technical = await Technical.aggregate([
                { $sample: { size: 1 } },
            ]);
            if (technical.length < 1)
                return reject({
                    message: 'Sytem without technicals',
                    code: 409,
                });

            const newTicket = new Ticket({
                state: 'technician assigned',
                technical: technical[0]._id,
                user: userId,
            });
            const ticketToken = jwt.sign(
                JSON.stringify(newTicket),
                process.env.TICKET_TOKEN_SECRET
            );
            newTicket.token = ticketToken;
            newTicket.ratingLink = `/rating_service/${newTicket.getId}`;
            newTicket.trackingLink = `/tracking_service/${newTicket.getId}`;
            newTicket
                .save()
                .then(() => {
                    resolve({
                        message: 'Saved ticket',
                    });
                })
                .catch(() => {
                    reject({ message: `Failed to write database`, code: 500 });
                });
        } catch (e) {
            reject({ message: `Error ${e}`, code: 500 });
        }
    });
};

module.exports = ticketCtrl;
