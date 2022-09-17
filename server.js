//Packages 
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const {Socket, Server} = require("socket.io")


// initializing express
const app = express()
//Inistializing server
let httpServer = app.listen(process.env.Port || 8000)
//Initializing the socket
const io = new Server(httpServer,{cors:{origin:"*"}})

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


// middleware usage
app.use(cors({ origin: "*" }))
app.use(express.urlencoded({ extended: false ,limit:'50mb'}))
app.use(express.static('public'))
app.use(express.json())
app.use(morgan('dev'))

//Routers usage
app.use('/auth', authRouter)
app.use(authenticate)
app.use('/question', questionRouter)
app.use('/quiz', quizRouter)



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
let rooms ={}
//Socket Logic
io.on("connection",(socket)=>{
    console.log(socket.id ,"connected")
    socket.on("create-room",(roomId)=>{
        console.log(roomId +" room created")
        //teacher id is required in case teacher refreshes page
        // rooms[roomId].admin.userId =teacherId
        rooms[roomId] ={}
        rooms[roomId].admin =socket.id
        rooms[roomId].members =[]
    })
    socket.on("join-room",(data)=>{
        if(rooms.hasOwnProperty(data.roomId)){
            socket.join(data.roomId)
            rooms[data.roomId].members.push({socket:socket.id,studentName:data.name})
            console.log(rooms[data.roomId].members)
            //Sending list of joined student
            io.to(rooms[data.roomId].admin).emit("joined-students-update",{socket:socket.id,studentName:data.name})
        }
    })
    socket.on("start-update-quiz",async (data)=>{
        if(rooms.hasOwnProperty(data.roomId)&&rooms[data.roomId].admin===socket.id){
         socket.to(data.roomId).emit("update-question",data.currQuestion)
        }
    })
    socket.on("receive-answer",(data)=>{
        console.log(data,rooms[data.roomId],socket.id)
        let studentIndex = rooms[data.roomId].members.findIndex(student=>student.socket===socket.id)
        console.log(studentIndex)
        let studentName = rooms[data.roomId].members[studentIndex].studentName
        io.to(rooms[data.roomId].admin).emit("answer-update",{studentName,answer:data.answer})
    })
    
})