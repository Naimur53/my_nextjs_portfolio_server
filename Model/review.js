const mongoose = require('mongoose')

// main schema 
const reviewSchema = new mongoose.Schema({
    img: String,
    user_name: String,
    user_email: String,
    profession: String,
    review: String,
    show: {
        type: Boolean,
        default: false
    },


})

module.exports = mongoose.model("review", reviewSchema);