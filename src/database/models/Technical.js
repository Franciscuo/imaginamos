const { Schema, model } = require('mongoose');

const TechnicalSchema = new Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
});

module.exports = model('Technical', TechnicalSchema);