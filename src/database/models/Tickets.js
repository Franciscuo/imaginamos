const { Schema, model } = require('mongoose');

const ticketsSchema = new Schema({
    state: { type: String, required: true },
    token: { type: String, required: true },
    ratingLink: { type: String, required: true },
    trackingLink: { type: String, required: true },
    technical: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = model('Ticket', ticketsSchema);