const mongoose = require('mongoose')

// main schema 
const bestProjects = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    live_link: {
        type: String,
        required: true,
    },
    code_link: {
        type: String,
        required: true,
    },
    project_type: {
        type: String,
        required: true,
    },
    detailId: String,
    technology: [{ type: String }],

})

module.exports = mongoose.model("best_projects", bestProjects);