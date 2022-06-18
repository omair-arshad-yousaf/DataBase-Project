const mongoose=require("mongoose");

const teacher_schema = new mongoose.Schema({

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
            type:String,
            required:true
            },
            status:{
                type:String,
                required:true
            }

})
const Teacherdb = mongoose.model("Teacher",teacher_schema);
module.exports = Teacherdb;