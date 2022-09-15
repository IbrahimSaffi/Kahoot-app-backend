//Packages 
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

//routers
const authRouter = require("./routes/auth")
const questionRouter = require("./routes/question")
const quizRouter = require("./routes/quiz")

//Database connect 
mongoose.connect("mongodb+srv://IbrahimSaffi:jmk161651@kahoot.f4i23sq.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
).then(()=>console.log("Connected to Database server"))
.catch((err)=>console.log(err))

// initializing express
const app = express()

// middleware usage
app.use(cors({ origin: "*" }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.json())
app.use(morgan('dev'))

//Routers usage
app.use('/auth', authRouter)
app.use(authenticate)
app.use('/question', questionRouter)
app.use('/quiz', quizRouter)

//Inistializing server
app.listen(process.env.Port || 8000)


function authenticate(req,res,next) {
 const authHeaderInfo = req.headers['authorization']
 if(authHeaderInfo===undefined){
    return res.status(401).send({error:"No token provided"})
 }
 else{
    const token = authHeaderInfo.split(" ")[1]
    if(token ===undefined){
        return res.status(401).send({error:"Proper token was not provide make sure its bearer token"})
    }
    try{
    const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    req.payload = payload
    next()
    }
    catch(error){
        return res.status(401).send({error:error.message})
    }
 }
}

