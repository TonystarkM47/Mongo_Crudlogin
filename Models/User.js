var mongoose = require('mongoose');
const {Schema} = mongoose;

const user = new Schema({
    user_name: String,
    user_dob: String,
    user_gender: String,
    user_mobile: Number,
    user_email: String,
    user_password: Number,
    user_isadmin: Boolean,
    user_joindate: {type: Date, default: Date.now},
    user_image: String,
});

var user_info = mongoose.model('User', user);
module.exports = user_info;