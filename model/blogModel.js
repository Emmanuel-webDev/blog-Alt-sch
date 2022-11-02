const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    tags:[{type:String}],
//4 & 8
   state:{
    type:String,
    enum:['draft', "published"],
    default: "draft"
   },
   reading_time:{
    type: Number,
   },
   read_count:{
    type: Number
   },
    timestamp: Date,
    body:{
        type:String,
        required: true
    },

    author:{
        type: mongoose.Schema.ObjectId,
        ref:"userModel"
    }
})

module.exports = mongoose.model("blogRoutes", schema)