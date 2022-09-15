const mongoose = require("mongoose")
const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "teacher"
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "question"
    }],
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "report"
    },
    progress:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "progress"
    },
    quizes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    }]


})
const userModel = mongoose.model("user", userScheme)
module.exports = userModel