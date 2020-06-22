const Technical = require('../../../database/models/Technical');

const technicalCtrl = {};

technicalCtrl.addTechnical = email => {
    return new Promise(async(resolve, reject) => {
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

module.exports = technicalCtrl;