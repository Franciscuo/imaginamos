const jwt = require('jsonwebtoken');
const Ticket = require('../../../database/models/Tickets');
const User = require('../../../database/models/Users');

const ticketCtrl = {};

ticketCtrl.newTicket = userId => {
    return new Promise(async(resolve, reject) => {
        try {
            const technical = await User.aggregate([
                { $match: { type: 1 } },
                { $sample: { size: 1 } },
            ]);
            if (!technical) return reject(`Sytem without technicals`);
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
            await newTicket
                .save()
                .then(() => {
                    resolve({
                        message: 'Saved ticket',
                    });
                })
                .catch(e => {
                    reject(`Failed to write database ${e}`);
                });
        } catch (e) {
            reject(`Error ${e}`);
        }
    });
};

module.exports = ticketCtrl;