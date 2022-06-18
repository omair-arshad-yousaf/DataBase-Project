const mongoose = require("mongoose")

const connectDB= async()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/dbProject',{
    useNewUrlParser: true,
})
    console.log(`connection successful`);
    }
catch(e){
    console.log(`no connection`);
}};

module.exports=connectDB;



