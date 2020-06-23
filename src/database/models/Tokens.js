const { Schema, model } = require('mongoose');

const RefreshTokenSchema = new Schema({
    token: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = model('RefreshToken', RefreshTokenSchema);
