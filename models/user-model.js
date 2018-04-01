const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    googleId: String,
    facebookId: String,
    rights: String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
