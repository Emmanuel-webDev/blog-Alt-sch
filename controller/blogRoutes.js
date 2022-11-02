const express = require('express');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const blogModel = require('../model/blogModel')
const users = require('../model/userModel')

const routes = express.Router()

const verifyToken = async (req, res, next)=>{
  const token = req.cookies.access_token
  if(!token) return res.status(403).send('Forbidden');

  const verify = jwt.verify(token, process.env.SECRET)
  const user = await users.findById(verify.id)
  req.user = user
  if(!verify) return res.status(403).send('Forbidden')

  next()
}

//5 && 14a,c
routes.get('/allpost', async (req, res)=>{
  const limitValue = 20
  const blogs = await blogModel.find({state:"published"}).limit(limitValue).skip((req.query.page-1)*limitValue).sort({timestamp: 1, read_count: 1, reading_time: 1})
  res.send(blogs)
})

//6 && 15
let readCount = 0
routes.get('/blog/:id', async (req, res)=>{
  let getBlog = await blogModel.findOne({_id: req.params.id, state:"published"})
   getBlog.read_count = readCount++
   
  if(!getBlog){
    return res.send('No blog')
  }
  res.send(getBlog)
})

//7

routes.post('/createBlog', verifyToken, async (req, res)=>{
  const {body, reading_time, read_count} = req.body

const amountOfWords = body.split(" ").length
const timeTaken = Math.round(amountOfWords / 200)
req.body.reading_time = timeTaken


    const newBlog = new blogModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      state: req.body.state,
      reading_time: req.body.reading_time,
      timestamp: new Date(),
      body: req.body.body,
      author: req.user
    })
    await newBlog.save()
    res.send(newBlog)
})

//9
routes.post('/publish/:id', verifyToken, async (req, res)=>{
const {state, body} = (req.body);

const  currentState  = "published"
if(req.body.state === currentState){
  return res.send('Blog already published')
}
req.body.state = currentState


const amountOfWords = body.split(" ").length
const timeTaken = Math.round(amountOfWords / 200)
req.body.reading_time = timeTaken

const publish = new blogModel({
  title: req.body.title,
  description: req.body.description,
  tags: req.body.tags,
  state:req.body.state,
  reading_time:req.body.reading_time,
  timestamp: new Date(),
  body: req.body.body,
  author: req.user._id
})
await publish.save()
res.send(publish)

})

//10
routes.post('/editBlog/:id', verifyToken, async (req, res)=>{
  const updateBlog = await blogModel.findByIdAndUpdate({_id: req.params.id}, req.body);
  res.send({data:updateBlog})
})

//11
routes.post('/deleteBlog/:id', verifyToken,async (req, res)=>{
 const del = await blogModel.findByIdAndRemove({_id: req.params.id})
})

//12a,b
routes.get('/personalBlogs', verifyToken, async (req, res)=>{
  const userBlog = await blogModel.aggregate([
    { $match:{author: req.user._id, state:"draft"}},
    {$limit: 5}
])

  if(userBlog.length === 0){
    return res.send('No post yet')
  }

  res.send(userBlog)
})

//14b
routes.get('/search', async(req, res)=>{
const getPost = await blogModel.aggregate([{$match: {title:{$regex: req.query.title, $options: "i"}}}])

if(getPost.length === 0){
  return res.send('No Blog found')
}

res.send(getPost)
})

module.exports = routes