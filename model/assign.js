const mongoose=require("mongoose");

const assign_schema = new mongoose.Schema({
    sno:{
        type:String,
        required:true,
        unique:true
    },
    section:{
        type:String,
        uppercase:true,
        required:true
    },
    title : {
    type:String,
    required:true
    },
    
    q1 : {
        type:String,
        required:true,
        },
        q2:{
            type:String,
            required:true
        },
        q3:{
            type:String,
            required:true
        },
        q4:{
            type:String,
            required:true
        }
})
const Assigndb = mongoose.model("Assignment",assign_schema);
module.exports = Assigndb;