const mongoose = require("mongoose")
const questionScheme = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "True/False"
    },
    choices: {
        type: Array,
        default: ["True", "False"]
    },
    timer: {
        type: Number,
        default: 30,
    },
    img: {
        type: String,
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    public:{
        type:Boolean,
        default:true
    },
    played:{
        type:Number,
        default:0
    },
    correct_answer:{
        type :String,
        required:true
    },
    correctly_answered:{
        type:Number,
        default:0
    }


})
const questionModel = mongoose.model("question", questionScheme)
module.exports = questionModel