const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const quizModel = require("../schemes/quizScheme")
const { find } = require('../schemes/userScheme')
const userModel = require('../schemes/userScheme')
const ObjectId = require("mongodb").ObjectId

//getting quiz template
//Might not need for minimum requirements
router.get('/:id',async (req,res)=>{
    let id = req.params.id
    console.log(id)
    let quiz = await quizModel.findById(id)
    .populate("questions")
    console.log(quiz)
    if(quiz===null){
        return res.status(400).send({error:"No such template"})
    }
    return res.status(200).send(quiz)
})
//adding quiz
router.post('/',async (req,res)=>{
let {questions,title,creater} = req.body
console.log(req.body)
if(!questions||!title||!creater){
    return res.status(400).send({error:"No questions or title of template provided"})
}
  let quiz =  new quizModel({
      questions,title
  })

  let savedQuiz =  await quiz.save()
  let user = await userModel.findByIdAndUpdate(creater,{$push:{quizes:savedQuiz}})
  return res.status(200).send({data:savedQuiz,response:"Quiz created"})
})
//updating quiz template
router.post('/:id',async (req,res)=>{
    let id = req.params.id
    console.log(id)
    const {questions,title} = req.body
    if(Object.keys(req.body).length===0){
        return res.status(400).send({error:"No data provided"})
    }
    let quiz = await quizModel.findById(id)
    if(quiz===null){
        return res.status(400).send({error:"No such template"})
    }
    let updatedData = await quizModel.findByIdAndUpdate(id,{questions,title})
    return res.status(200).send({updatedData,response:"Succesfully updated"})
})
router.delete('/:id',async (req,res)=>{
    let id = req.params.id
    let quiz = await quizModel.findById(id)
    if(quiz===null){
        return res.status(400).send({error:"No such template"})
    }
    await quizModel.findByIdAndDelete(id)
    return res.status(200).send({id,response:"Deleted Succesfully"})
})
//Might not need(extra)
//To get all quizes templates by particuler user
router.get("/:uid",async (req,res)=>{
      let uid = req.params.id
      let templates = await quizModel.find({creater:uid}).populate("questions")
      res.status(200).send(templates)
})
module.exports = router