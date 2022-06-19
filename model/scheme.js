const mongoose=require("mongoose");

const student_schema = new mongoose.Schema({
    sno:{
        type:String,
        required:true,
        unique:true
    },
    name : {
    type:String,
    required:true
    },
    
    email : {
        type:String,
        required:true,
        unique:true
        },

        password : {
        type:String,
        required:true
        },

        confirmpass : {
        type:String,
        required:true
        },
        age : {
            type:Number,
            required:true
            },
            section:{
                type:String,
                required:true,
                uppercase:true
            },
            status:{
                type:String,
                required:true
            }

})
const Studentdb = mongoose.model("Student",student_schema);
module.exports = Studentdb;