const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    token:{
        type: String,
    }
});

const urlShortId = new mongoose.Schema({
    originalUrl: {
        type: String,
    },
    shortId: {
        type: String,
        unique: true
    }
},{ versionKey:false});

module.exports.user = userSchema; 
module.exports.urlShortId = urlShortId;