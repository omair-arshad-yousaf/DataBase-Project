const mongoose=require("mongoose");

const admin_schema = new mongoose.Schema({
    email : {
        type:String,
        required:true
        },
        password:{
            type:String,
            required:true
        }})
        const Admindb = mongoose.model("admin",admin_schema);
module.exports = Admindb;