const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const users = require('../model/userModel')

const routes = express.Router()

//2
routes.post('/signup', async (req, res)=>{
const {first_name, last_name, email, password} = req.body

const hashed = await bcrypt.hash(password, 12)
req.body.password = hashed

const newUser = new users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password:req.body.password
})
 await newUser.save()
 res.send({data: newUser})

})

//3
routes.post('/login', async (req, res)=>{
const {email, password} =  (req.body)

//validation
const existingUser = await users.findOne({email: email})
if(!existingUser){
    return res.send('Invalid mail')
}

const checkCode = await bcrypt.compare(password, existingUser.password)
if(!checkCode){
    return res.send('Invalid code')
}

//authentication
const authenticate = jwt.sign({id : existingUser._id, dt : new Date()}, process.env.SECRET, {expiresIn: "1hr"})

res.cookie("access_token", authenticate, {
    httpOnly:true,
    secure:false
}).send({message: "Login successful"})

})




module.exports = routes
