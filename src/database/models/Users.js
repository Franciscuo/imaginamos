const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    tokens: [
        { type: String }
    ]
})

UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', UserSchema);