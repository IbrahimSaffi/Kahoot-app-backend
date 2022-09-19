const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const questionModel = require("../schemes/questionScheme")
const userModel = require('../schemes/userScheme')
const ObjectId = require("mongodb").ObjectId
const multer = require('multer')

// Initializing multer

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/upload")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
}) 
//getting random question
router.get('/', async (req, res) => {
    //reference https://stackoverflow.com/questions/14644545/random-document-from-a-collection-in-mongoose
    let count = await questionModel.count({})
    let random = Math.floor(Math.random() * count);
    let question = await questionModel.findOne({}).skip(random)
    if(question){
        let correctly_answered = question.correctly_answered + 1
        await questionModel.findOneAndUpdate({ _id: question._id }, { correctly_answered })
    }
    return res.status(200).send(question)
})
// To add question
const upload = multer({storage})
router.post('/add',upload.single("img"),async (req, res) => {
    console.log(req.body)
    let { text, type, timer, choices, creater, public ,correct_answer} = req.body
    console.log(req.file)
    if (!text, !creater,!correct_answer) {
        return res.status(400).send({ error: "Please provide all required fields" })
    }
    // if(choices){
    //     choices = choices)
    // }
    //Add img support
    let imageUrl;
    if(typeof(req.file)==="object"){
    imageUrl = process.env.BASE_URL+'upload/' +req.file.filename
    }
    let question =  new questionModel({
        text, choices, creater:ObjectId(creater), type, timer, img:imageUrl, creater, public,correct_answer
    })
    await question.save()
    return res.status(200).send({ data: question, response: "Question succesfully added" })
})

router.get('/:id',async (req, res) => {
    let id = req.params.id
    try{
        let question = await questionModel.findById(id)
        if (question === null) {
            return res.status(400).send({ error: "No such question" })
        }
        else {
            return res.status(200).send(question)
        }
    }
    catch(err){
        return res.status(400).send({ error: "Invalid id" })
    }
})

//To edit question
router.post("/:id",async (req, res) => {
    let id = req.params.id
    console.log(id)
    let question = await questionModel.findOne({ _id: ObjectId(id) })
    console.log(question)
    if (question === null) {
        return res.status(400).send({ error: "No such question" })
    }
    if (req.body === {}) {
        let correctly_answered = question.correctly_answered + 1
        try{
            await questionModel.findOneAndUpdate({ _id: ObjectId(id) }, { correctly_answered })
            return res.status(200).send(question)
        }
        catch(err){
            return res.status(400).send({"error":"Inavlid Id"})
        }
    }
    else {
        const { text, type, timer, choices, img, creater, public } = req.body
        try{
            console.log(req.body)
            for (var key of req.body.entries()) {
                console.log(key[0] + ', ' + key[1])
            }
            let updatedQuestion =  await questionModel.findOneAndUpdate({ _id: ObjectId(id) }, { text, choices, creater, type, timer:Number(timer), img, creater, public })
            return res.status(200).send({data:updatedQuestion,response:"Question Updated"})
        }
        catch(err){
            console.log(err)
            return res.status(400).send({"error":"Inavlid Id"})
        }
    }
})
//Delete Question
router.delete("/:id", async(req, res) => {
    let id = req.params.id
    try{
        let question = await questionModel.findOne({ _id: ObjectId(id) })
        if (question === null) {
            return res.status(400).send({ error: "No such question" })
        }
            await questionModel.findOneAndDelete({ _id: question._id })
            return res.status(200).send({id,response:"Question succesfully deleted"})
        }   
        catch(err){
            return res.status(400).send({"error":"Inavlid Id"})
        } 

    }
)
//Extra functionality
//search quesion by query to get publically available questions
//Add subject type to question to get personalized random questions
module.exports = router