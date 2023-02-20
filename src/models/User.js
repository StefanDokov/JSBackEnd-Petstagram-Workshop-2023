const mongoose = require('mongoose');
const {isEmail} = require('validator');



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username is required!"],
        minLenght: 2
    },
    email: {
        type: String,
        required: [true,"Email is required!"],
        minLength: 10

    },
    password: {
        type: String,
        required: [true,"Password is required!"],
        minLength: 4
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
