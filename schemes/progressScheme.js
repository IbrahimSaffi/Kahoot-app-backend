const mongoose = require("mongoose")
const progressScheme = new mongoose.Schema({
  questions_attempted:{
    type:Number,
    default:0,
  },
  correct_answers:{
    type:Number,
    default:0,
  },
  //rank could be seprate scheme(extra/last priority)
  rank:{
    type:Number,
    default:0
  },
})
const progressModel = mongoose.model("progress",progressScheme)
module.exports = progressModel