const mongoose = require("mongoose")
const reportScheme = new mongoose.Schema({
  questions_created:{
    type:Number,
    default:0,
  },
  feedbacks:{
    type:Array,
    default:[]
  },
  questions_popularity:{
    type:Number,
    default:0
  },
  //rank could be seprate scheme(extra/last priority)
  rank:{
    type:Number,
    default:0
  },
})
const reportModel = mongoose.model("report",reportScheme)
module.exports = reportModel