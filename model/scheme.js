const mongoose=require("mongoose");

const student_schema = new mongoose.Schema({

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
        require:true
        },
        age : {
            type:String,
            required:true
            }

})

const Studentdb = mongoose.model("Student",student_schema);
module.exports = Studentdb;