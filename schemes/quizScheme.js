const mongoose = require("mongoose")
const quizScheme = new mongoose.Schema({
     questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
     }],
     title:{
      type:String,
      required:true,
     },
     updated_at:{
        type:Date,
        default:new Date()
     },
    created_at:{
        type:Date,
        default:new Date()
     },
    //rank could be seprate scheme(extra/last priority)
    //rank should be in report scheme
  rank:{
    type:Number,
    default:0
  },
})
const quizModel = mongoose.model("quiz",quizScheme)
module.exports = quizModel