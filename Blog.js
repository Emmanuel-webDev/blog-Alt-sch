const express = require('express');
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const usersRoutes = require('./controller/userRoutes')
const blogRoutes = require('./controller/blogRoutes')

const app = express();
require('dotenv').config()

mongoose.connect(process.env.URI, {UseNewUrlParser: true}).then(()=>{

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookie())

app.use(usersRoutes)
app.use(blogRoutes)
  
app.listen(process.env.PORT, ()=>{
    console.log(`Running on ${process.env.PORT}`)
})

})

