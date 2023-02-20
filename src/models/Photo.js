const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//,
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    description: {
        type: String,
        required: true,
        minLength : 5,
        maxLength: 50
    },
    location: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    commentList: [{
        userID: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }, comment: {
            type: String
        }
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }



});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;