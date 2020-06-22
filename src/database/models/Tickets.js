const { Schema, model } = require('mongoose');

const TicketsSchema = new Schema({
    state: { type: String, required: true },
    token: { type: String, required: true },
    ratingLink: { type: String, required: true },
    trackingLink: { type: String, required: true },
    technical: { type: Schema.ObjectId, ref: 'User' },
    user: { type: Schema.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
});

TicketsSchema.virtual('getId').get(function () {
    return this._id;
});

module.exports = model('Ticket', TicketsSchema);
