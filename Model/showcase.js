const mongoose = require('mongoose')

// main schema 
const showcaseSchema = new mongoose.Schema({
    img: String,
    link: String,
    heading: String,


})

module.exports = mongoose.model("showcase", showcaseSchema);