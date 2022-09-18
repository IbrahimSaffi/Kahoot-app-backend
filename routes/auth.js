const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userModel = require("../schemes/userScheme")
const quizModel = require('../schemes/quizScheme')

router.post('/signup', async (req, res) => {
    const { name, email, password, type } = req.body
    console.log(req.body)
    if (!name, !email, !password) {
        return res.status(400).send({ error: "Some fields missing" })
    }
    //could make mistake here

    let userExist = await userModel.findOne({ email: email.toLowerCase() })
    if (userExist !== null) {
        return res.status(400).send({ error: "User already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    try {
        let user =  new userModel({
            name,
            email: email.toLowerCase(),
            password: hash,
            type: type
        })
        await user.save()
        return res.status(200).send({ data: user, response: "User succesfully created" })
    }
    catch (err) {
        return res.status(err.status).send(err)
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ error: "Some fields missing" })
    }
    let user = await userModel.findOne({ email: email.toLowerCase() }).populate("quizes")
    if (!user) {
        return res.status(400).send({ error: "User do no exist" })
    }
    let payload = { id: user._id, user: user.email, user: user.password }
    const verifyUser = bcrypt.compare(password, user.password)
    if (!verifyUser) {
        return res.status(400).send({ error: "Incorrect password" })
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
    return res.status(200).send({ refreshToken, accessToken, profile: user })
})
router.post('/token', async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).send({ error: "No refresh token Provided" })
    }
    try {
        console.log(process.env.REFRESH_TOKEN_SECRET,refreshToken)
        let payload =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log(payload)
        delete payload.exp
        delete payload.iat
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
        return res.status(200).send({ accessToken })
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Invalid refresh token" })
    }
})
module.exports = router