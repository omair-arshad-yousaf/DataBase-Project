const mongoose=require("mongoose");

const class_schema = new mongoose.Schema({
    sno:{
        type:String,
        required:true,
        unique:true
    },
    section : {
    type:String,
    required:true,
    lowercase:true,
    unique:true
    },
    
    seats : {
        type:Number,
        required:true,
        }

})
const Classdb = mongoose.model("Class",class_schema);
module.exports = Classdb;