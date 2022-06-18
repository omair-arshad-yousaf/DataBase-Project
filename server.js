const  express = require("express");
const app = express();


const path = require("path");
const ejs = require('ejs');

const axios = require("axios");

//getting path of public folder
const static_path= path.join(__dirname,"/public")
//getting path of views folder
const views= path.join(__dirname,"/views")

app.use(express.static(static_path));
app.use(express.static(views));

app.set("view engine", "ejs");

const connectDB = require("./db/connection");
connectDB()

// const controller = require('./server/controller');
app.use(express.urlencoded({extended:false}));
var Studentdb = require("./model/scheme");
// const Teacherdb = require("./model/teacher_schema");

app.get("/", (req,res)=>{
    res.render("index")
})

app.get("/student", (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        Studentdb.findById(id).then(users=>{
            if(!users){
                res.status(404).send({message:`Cannot find user with id ${id}`});
            }
            else{
                console.log(users);
                res.render("students/show",{users})
        }   
    }).catch(err=>{
        res.status(500).send({message:`Error retriving user with id ${id}`})
    })}
else{
    Studentdb.find()
    .then(users=>{
        res.render("students/student",{users})
    })
.catch(err=>{
    res.status(500).send({message:err.message||"Error finding Data"});
})}
})

// app.get("/student/find",(req,res)=>{
//     res.render("students/find");
// })

// app.post("/student/find/result",(req,res)=>{
//     console.log(req.body.name);
//     const id = req.body.name;
//         Studentdb.find({name:req.body.name}).then(users=>{
//             if(!users){
//                 res.status(404).send({message:`Cannot find user with id ${id}`});
//             }
//             else{
//                 console.log(users);
//                 res.render("students/show",{id})
//         }   
//     }).catch(err=>{
//         res.status(500).send({message:`Error retriving user with id ${id}`})
//     })
// })

//create student
app.get("/student/create", (req,res)=>{
    res.render("students/create")
})
app.post("/student/create",(req,res)=>{
    if(!req.body){
        req.status(400).send({message:"Content cannot be empty "});
        return;
    }
    const users= new Studentdb({
    name: req.body.name,
    email: req.body.email,
    password : req.body.password,
    confirmpass: req.body.confirmpass,
    age: req.body.age,
    status:req.body.status
    })
    users
    .save(users)
    .then(users=>{
        res.redirect("/student")
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"Some error occured while creating user"
        });
    })

});

//find student
// app.get("/student/find",controller.find);
// app.get("/student/find/:id",controller.findbyId)

//update student 
app.get("/student/update/:id",(req,res)=>{
    const id= req.params.id;
    Studentdb.findById(id).then(users=>{
        if(!users){
            res.status(404).send({message:`Cannot find user with id ${id}`});
        }
        else{
            res.render("students/update",{users})
    }   
}).catch(err=>{
    res.status(500).send({message:`Error retriving user with id ${id}`})
})})
    
app.post("/student/update/:id",(req,res)=>{
    if(!req.body){
        return res.status(400).send({message:"Data to update cannot be empty"});
    }
    
    const id= req.params.id;
    Studentdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.send({message:`Cannot update user with ${id}.Maybe user not found`})
        }
        res.redirect("/student");
    })
  
});

//delete student
app.get("/student/delete/:id",(req,res)=>{
    const id = req.params.id;

    Studentdb.findByIdAndDelete(id).then(data=>{
        if(!data){
            res.status(404).send({message:`Cannot delete user with id ${id}  `});
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/student");
        }
    }).catch(err=>{
        res.status(500).send({message:`Couldn't delete user with id ${id}`});
    })
})


app.listen(5500);
