const mongoose=require("mongoose");

const course_schema = new mongoose.Schema({
    sno:{
        type:String,
        required:true,
        unique:true
    },
    name : {
    type:String,
    required:true
    },
    
    teacher : {
        type:String,
        required:true,
        },
        credit:{
            type:Number,
            required:true
        }

})
const Coursedb = mongoose.model("Course",course_schema);
module.exports = Coursedb;