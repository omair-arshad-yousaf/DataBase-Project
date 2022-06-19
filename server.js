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
var Teacherdb = require("./model/teacher");
var Admindb = require("./model/admin");

app.get("/admin_login", (req,res)=>{
    res.render("login/admin_login")
})
app.post("/admin_login",async(req,res)=>{
    try{
        const id =req.body.email;
        const password= req.body.password;
        const admin = await Admindb.findOne({email:id});
        console.log(req.body.password);
        if(admin.password===password){
            res.render("index");
        }
        else{
            res.render("students/error2");
        }

    }
    catch{
        res.render("students/error3");
    }

})

app.get("/admin_home",(req,res)=>{
    res.render("index");
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
        if(req.query.name){

            const name = req.query.name;
            Studentdb.findOne({name:name}).then(users=>{
                if(!users){
                  res.render("students/error3")
                }
                else{
                    console.log(users);
                    res.render("students/show",{users})
            }   
        }).catch(err=>{
            res.send("oops error occured")
        })}
        else if(req.query.sno){

            const id = req.query.sno;
            Studentdb.findOne({sno:id}).then(users=>{
                if(!users){
                    res.render("students/error3");
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
    res.send({message:err.message||"Error finding Data"});
})
        }

    }
})
app.get("/student_find_id",(req,res)=>{
    res.render("students/find_id");
})
app.get("/student_find",(req,res)=>{
    res.render("students/find");
})
//create student
app.get("/student_create", (req,res)=>{
    res.render("students/create")
})
app.post("/student_create",(req,res)=>{
    if(!req.body){
        req.status(400).send({message:"Content cannot be empty "});
        return;
    }
    const users= new Studentdb({
    sno:req.body.sno,
    name: req.body.name,
    email: req.body.email,
    password : req.body.password,
    confirmpass: req.body.confirmpass,
    age: req.body.age,
    section: req.body.section,
    status:req.body.status
    })
    if(req.body.password===req.body.confirmpass){
        users
        .save(users)
        .then(users=>{
            res.redirect("/student")
        })
        .catch(err=>{
           res.redirect("/error1");
        })}
        else{
            res.redirect("/error2");
        }

});

app.get("/admin_create",(req,res)=>{
    res.render("teachers/cr_admin");
})
app.post("/admin_create",(req,res)=>{
    if(!req.body){
        req.status(400).send({message:"Content cannot be empty "});
        return;
    }
    const users= new Admindb({
    email:req.body.email,
    password: req.body.pass,
    })
        users
        .save(users)
        .then(users=>{
            res.redirect("/student")
        })
        .catch(err=>{
           res.redirect("/error1");
        })

});

//find student
// app.get("/student/find",controller.find);
// app.get("/student/find/:id",controller.findbyId)

//update student 
app.get("/student_update/:id",(req,res)=>{
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
    
app.post("/student_update/:id",(req,res)=>{
    if(!req.body){
        res.redirect("/error1")
    }
    
    const id= req.params.id;
    if(req.body.password===req.body.confirmpass){
    Studentdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.redirect("/error1")
        }
        res.redirect("/student");
    })}
    else{
        res.redirect("/error2")
    }
  
});
app.get("/student_del/:id",(req,res)=>{
    const id=req.params.id;
    Studentdb.findById(id).then(users=>{
        if(!users){
            res.status(404).send({message:`Cannot find user with id ${id}`});
        }
        else{
            res.render("students/del",{users})
    }   
})})

//delete student
app.get("/student_delete/:id",(req,res)=>{
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


// Teacher Routes
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------


app.get("/teacher", (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        Teacherdb.findById(id).then(users=>{
            if(!users){
                res.status(404).send({message:`Cannot find user with id ${id}`});
            }
            else{
                console.log(users);
                res.render("teachers/show",{users})
        }   
    }).catch(err=>{
        res.status(500).send({message:`Error retriving user with id ${id}`})
    })}
    else{
        if(req.query.name){

            const name = req.query.name;
            Teacherdb.findOne({name:name}).then(users=>{
                if(!users){
                  res.render("teachers/error3")
                }
                else{
                    console.log(users);
                    res.render("teachers/show",{users})
            }   
        }).catch(err=>{
            res.send("oops erro occured")
        })}
        else if(req.query.sno){

            const id = req.query.sno;
            Teacherdb.findOne({sno:id}).then(users=>{
                if(!users){
                    res.render("teachers/error3");
                }
                else{
                    console.log(users);
                    res.render("teachers/show",{users})
            }   
        }).catch(err=>{
            res.status(500).send({message:`Error retriving user with id ${id}`})
        })}
        
        else{
            Teacherdb.find()
    .then(users=>{
        res.render("teachers/teacher",{users})
    })
.catch(err=>{
    res.send({message:err.message||"Error finding Data"});
})
        }

    }
})


// app.get("/teacher/show/:id",(req,res)=>{
//     if(req.query.id){

//         const id = req.query.id;
//         Teacherdb.findOne({id:id}).then(users=>{
//             if(!users){
//                 res.status(404).send({message:`Cannot find user with id ${id}`});
//             }
//             else{
//                 console.log(users);
//                 res.render("teachers/show",{users})
//         }   
//     }).catch(err=>{
//         res.status(500).send({message:`Error retriving user with id ${id}`})
//     })}
//     else{
//         res.send("cannot find anything");
//     }
// })
//create teacher
app.get("/teacher_create", (req,res)=>{
    res.render("teachers/create")
})
app.post("/teacher_create",(req,res)=>{
    if(!req.body){
        req.status(400).send({message:"Content cannot be empty "});
        return;
    }
    const users= new Teacherdb({
    sno:req.body.sno,
    name: req.body.name,
    email: req.body.email,
    password : req.body.password,
    confirmpass: req.body.confirmpass,
    age: req.body.age,
    status:req.body.status,
    })
    if(req.body.password===req.body.confirmpass){
    users
    .save(users)
    .then(users=>{
        res.redirect("/teacher")
    })
    .catch(err=>{
       res.redirect("/error1");
    })}
    else{
        res.redirect("/error2");
    }

});

app.get("/error1",(req,res)=>{
    res.render("teachers/error1");
})
app.get("/error2",(req,res)=>{
    res.render("teachers/error2");
})

app.get("/teacher_find_id",(req,res)=>{
    res.render("teachers/find_id");
})
app.get("/teacher_find",(req,res)=>{
    res.render("teachers/find");
})


//find student
// app.get("/student/find",controller.find);
// app.get("/student/find/:id",controller.findbyId)

//update teacher 
app.get("/teacher_update/:id",(req,res)=>{
    const id= req.params.id;
    Teacherdb.findById(id).then(users=>{
        if(!users){
            res.status(404).send({message:`Cannot find user with id ${id}`});
        }
        else{
            res.render("teachers/update",{users})
    }   
}).catch(err=>{
    res.status(500).send({message:`Error retriving user with id ${id}`})
})})
    
app.post("/teacher_update/:id",(req,res)=>{
    if(!req.body){
        res.redirect("/error1")
    }
    
    const id= req.params.id;
    if(req.body.password===req.body.confirmpass){
    Teacherdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.redirect("/error1");
        }
        res.redirect("/teacher");
    })}
    else{
        res.redirect("/error2")
    }
  
});

app.get("/teacher_del/:id",(req,res)=>{
    const id=req.params.id;
    Teacherdb.findById(id).then(users=>{
        if(!users){
            res.status(404).send({message:`Cannot find user with id ${id}`});
        }
        else{
            res.render("teachers/del",{users})
    }   
})})
//delete teacher
app.get("/teacher_delete/:id",(req,res)=>{
    const id = req.params.id;

    Teacherdb.findByIdAndDelete(id).then(data=>{
        if(!data){
            res.status(404).send({message:`Cannot delete user with id ${id}  `});
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/teacher");
        }
    }).catch(err=>{
        res.status(500).send({message:`Couldn't delete user with id ${id}`});
    })
})



app.listen(5500);
