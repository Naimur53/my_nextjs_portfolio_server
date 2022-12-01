
const mongoose = require('mongoose')
// small schema
const userSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    photoURL: String,
    createdAt: String,
    uid: String,

})

const imgSchema = new mongoose.Schema({
    url: String,
    title: String,
})

const sectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: {
        type: String,
        default: '',
    },
    img: [imgSchema],
    video: '',
    column: Boolean,
    reverse: Boolean,

})

const commentSchema = new mongoose.Schema({
    user: userSchema,
    time: {
        type: Date,
        default: () => new Date(),
    },
    comment: String

})
// main schema 
const blogSchema = new mongoose.Schema({
    img: String,
    date: {
        type: Date,
        default: () => new Date(),
    },
    heading: String,
    description: String,
    address: String,
    tags: [String],
    love: [userSchema],
    comments: [commentSchema],
    sections: [sectionSchema],

})
module.exports = mongoose.model("blog", blogSchema);