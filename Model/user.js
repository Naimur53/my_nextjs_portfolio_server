const mongoose = require('mongoose')

// main schema 
const userSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    photoURL: String,
    createdAt: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    uid: String,

})

module.exports = mongoose.model("user", userSchema);