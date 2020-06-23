const moment = require('moment');
const Technical = require('../../../database/models/Technical');
const Tickets = require('../../../database/models/Tickets');

const technicalCtrl = {};

technicalCtrl.addTechnical = email => {
    return new Promise(async (resolve, reject) => {
        try {
            if (email.length < 2)
                return reject({ message: 'Email too short', code: 400 });
            const technical = await Technical.findOne({ email });
            if (technical)
                return reject({
                    message: 'This email is already registered',
                    code: 409,
                });
            const newTechnical = new Technical({ email });
            newTechnical
                .save()
                .then(() => {
                    resolve({
                        message: 'Saved technical',
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

technicalCtrl.dayTechnical = email => {
    return new Promise(async (resolve, reject) => {
        try {
            const technical = await Technical.findOne({ email });
            if (!technical)
                return reject({
                    message: 'This email is not registered',
                    code: 400,
                });
            const start = moment().startOf('day');
            const end = moment().endOf('day');
            const tickets = await Tickets.find(
                {
                    technical: technical._id,
                    date: { $gte: start, $lt: end },
                },
                {
                    technical: 0,
                    token: 0,
                    trackingLink: 0,
                    ratingLink: 0,
                    __v: 0,
                }
            ).populate('user', {
                _id: 0,
                password: 0,
                date: 0,
                __v: 0,
            });
            resolve(tickets);
        } catch (e) {
            reject({ message: `Error ${e}`, code: 500 });
        }
    });
};
module.exports = technicalCtrl;
