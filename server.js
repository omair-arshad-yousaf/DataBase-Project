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
var Coursedb = require("./model/course");
var Classdb = require("./model/class");
var Assigndb = require("./model/assign");

//admin login part
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

//user login part 
app.get("/user_login", (req,res)=>{
    res.render("login/user_login")
})
app.post("/user_login",async(req,res)=>{
    try{
        const id =req.body.sno;
        const password= req.body.password;
        const stud = await Studentdb.findOne({sno:id});
        if(stud.password===password ){
            if(stud.status=="active"){
                res.render("student_home",{stud});}
                else{
                    res.render("error4");
                }
        }
        else{
            res.render("students/error3");
        }
    }
    catch{
        res.render("students/error3");
    }
})
// student assignment
app.get("/student_assign",async(req,res)=>{
        const id = req.query.id;
        const stud = await Studentdb.findById(id);
        // console.log(stud);
    Studentdb.findById(id).then(users=>{
        if(!users){
    res.send("error 1")
           }
        else{
          Assigndb.find({section:stud.section}).then(users=>{
            if(!users){
                console.log(stud);
                res.send("error 2")
            }
            else{
                res.render("stud_assign",{users});
            }
          })
           
    }   
})})


app.get("/teacher_login", (req,res)=>{
    res.render("login/teacher_login")
})
app.post("/teacher_login",async(req,res)=>{
    try{
        const id =req.body.sno;
        const password= req.body.password;
        const stud = await Teacherdb.findOne({sno:id});
        if(stud.password===password ){
            if(stud.status=="active"){
                res.render("teacher_portal",{stud});}
                else{
                    res.render("error4");
                }
        }
        else{
            res.render("students/error3");
        }
    }
    catch{
        res.render("students/error3");
    }
})
app.get("/user_timetable",(req,res)=>{
    res.render("students/timetable");
})


app.get("/admin_home",(req,res)=>{
    res.render("index");
})

//  student portal
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
    
//  admin side /student tables code
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------

//findign student profile
app.get("/student_prof", (req,res)=>{
  
        const id = req.query.id;
        console.log(id)
        Studentdb.findById(id).then(users=>{
            if(!users){
        res.render("students/error3") 
               }
            else{
                // console.log(users);
                res.render("stud_prof",{users})
        }   
    }).catch(err=>{
        res.status(500).send({message:`Error retriving user with id ${id}`})
    })})


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

            Studentdb.find({name:req.query.name}).then(users=>{
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

            // const id = req.query.sno;
            Studentdb.find({sno:req.query.sno}).then(users=>{
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
            Studentdb.find().then(users=>{
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
    const users = new Studentdb({
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
        users.save(users).then(users=>{
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


//teacher profile

app.get("/teacher_prof", (req,res)=>{
  
    const id = req.query.id;
    console.log(id)
    Teacherdb.findById(id).then(users=>{
        if(!users){
    res.render("teachers/error3") 
           }
        else{
            // console.log(users);
            res.render("teach_prof",{users})
    }   
}).catch(err=>{
    res.render("teachers/error1") 
})})



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
            // let data ={};
            //  data = {name:req.query.name};
            Teacherdb.find({name:req.query.name}).then(users=>{
                if(!users){
                  res.render("teachers/error3")
                }
                else{
                    console.log(users);
                    res.render("teachers/show",{users});
            }  
        }).catch(err=>{
            res.send("oops erro occured")
        })}
        else if(req.query.sno){

            Teacherdb.find({sno:req.query.sno}).then(users=>{
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
app.get("/error3",(req,res)=>{
    res.render("teachers/error3");
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
            res.render("teachers/error3");
        }
        else{
            res.render("teachers/update",{users})
    }   
}).catch(err=>{
    res.render("teachers/error1");
})})
    
app.post("/teacher_update/:id",(req,res)=>{
    if(!req.body){
        res.redirect("/error1")
    }
    
    const id= req.params.id;
    if(req.body.password===req.body.confirmpass){
    Teacherdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.redirect("/error3");
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
            res.render("teachers/error3");
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
            res.render("teachers/error3");
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/teacher");
        }
    }).catch(err=>{
        res.render("teachers/error1");
    })
})

// --------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
//----------------------------------------------------
//course operations


app.get("/course", (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        Coursedb.findById(id).then(users=>{
            if(!users){
                res.render("courses/error3");
            }
            else{
                // console.log(users);
                res.render("courses/show",{users})
        }   
    }).catch(err=>{
        res.render("courses/error1");
    })}       
        else{
            Coursedb.find()
    .then(users=>{
        res.render("courses/course",{users})
    })
.catch(err=>{
    res.render("teachers/error1");
})
        }

    })


//create course
app.get("/course_create", (req,res)=>{
    res.render("courses/create")
})
app.post("/course_create",(req,res)=>{
    if(!req.body){
        res.render("courses/error3");
        return;
    }
    const users= new Coursedb({
    sno:req.body.sno,
    name: req.body.name,
    teacher: req.body.teacher,
    credit : req.body.credit
    })
    users
    .save(users)
    .then(users=>{
        res.redirect("/course")
    })
    .catch(err=>{
        res.render("courses/error1");
    })
});

app.get("/course_del",(req,res)=>{
    res.render("courses/del");
})
app.get("/error1",(req,res)=>{
    res.render("courses/error1");
})
app.get("/error3",(req,res)=>{
    res.render("courses/error3");
})

//update course 
app.get("/course_update/:id",(req,res)=>{
    const id= req.params.id;
    Coursedb.findById(id).then(users=>{
        if(!users){
            res.render("courses/error3");
        }
        else{
            res.render("courses/update",{users})
    }   
}).catch(err=>{
    res.render("courses/error1");
})})
   
app.post("/course_update/:id",(req,res)=>{
    if(!req.body){
        res.redirect("/error1")
    }
    
    const id= req.params.id;
    Coursedb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.redirect("/error1");
        }
        res.redirect("/course");
    })
  
});

//delete course

app.get("/course_del/:id",(req,res)=>{
    const id=req.params.id;
    Coursedb.findById(id).then(users=>{
        if(!users){
            res.render("courses/error3");
        }
        else{
            res.render("courses/del",{users})
    }   
}).catch(err=>{
    res.render("courses/error1");
})})

app.get("/course_delete/:id",(req,res)=>{
    const id = req.params.id;

    Coursedb.findByIdAndDelete(id).then(data=>{
        if(!data){
            res.render("courses/error3");
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/course");
        }
    }).catch(err=>{
        res.render("courses/error1");
    })
})

// --------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
//----------------------------------------------------
//class operations


app.get("/class", (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        Classdb.findById(id).then(users=>{
            if(!users){
                res.render("classes/error1");
            }
            else{
                // console.log(users);
                res.render("classes/show",{users})
        }   
    }).catch(err=>{
        res.render("classes/error1");
    })}       
        else{
            Classdb.find()
    .then(users=>{
        res.render("classes/class",{users})
    })
.catch(err=>{
    res.render("classes/error1");
})
        }

    })


//create course
app.get("/class_create", (req,res)=>{
    res.render("classes/create")
})
app.post("/class_create",(req,res)=>{
    if(!req.body){
        res.render("classes/error3");
        return;
    }
    const users= new Classdb({
    sno:req.body.sno,
    section: req.body.section,
    seats: req.body.seats,
    })
    users
    .save(users)
    .then(users=>{
        res.redirect("/class")
    })
    .catch(err=>{
       res.render("classes/error1");
    })
});

app.get("/class_del",(req,res)=>{
    res.render("classes/del");
})
app.get("/error1",(req,res)=>{
    res.render("classes/error1");
})
app.get("/error3",(req,res)=>{
    res.render("classes/error3");
})

//update course 
app.get("/class_update/:id",(req,res)=>{
    const id= req.params.id;
    Classdb.findById(id).then(users=>{
        if(!users){
            res.render("classes/error3");
        }
        else{
            res.render("classes/update",{users})
    }   
}).catch(err=>{
    res.render("classes/error1");
})})
   
app.post("/class_update/:id",(req,res)=>{
    if(!req.body){
        res.render("classes/error1")
    }
    
    const id= req.params.id;
    Classdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.render("classes/error1");
        }
        res.redirect("/class");
    })
  
});

//delete course

app.get("/class_del/:id",(req,res)=>{
    const id=req.params.id;
    Classdb.findById(id).then(users=>{
        if(!users){
            res.render("classes/error3");
        }
        else{
            res.render("classes/del",{users})
    }   
}).catch(err=>{
    res.status(500).send({message:`Couldn't delete user with id ${id}`});
})})

app.get("/class_delete/:id",(req,res)=>{
    const id = req.params.id;

    Classdb.findByIdAndDelete(id).then(data=>{
        if(!data){
            res.render("classes/error3");
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/class");
        }
    }).catch(err=>{
        res.status(500).send({message:`Couldn't delete user with id ${id}`});
    })
})

//  Assignment Codes
// ----------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
app.get("/assign", (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        Assigndb.findById(id).then(users=>{
            if(!users){
                res.render("assignments/error1");
            }
            else{
                // console.log(users);
                res.render("assignments/show",{users})
        }   
    }).catch(err=>{
        res.render("assignments/error1");
    })}       
        else{
            Assigndb.find()
    .then(users=>{
        res.render("assignments/assignment",{users})
    })
.catch(err=>{
    res.render("assignments/error1");
})
        }

    })


//create course
app.get("/assign_create", (req,res)=>{
    res.render("assignments/create")
})
app.post("/assign_create",(req,res)=>{
    console.log(req.body);

    if(!req.body){
        res.render("assignments/error3");
        return;
    }
    const users= new Assigndb({
    sno:req.body.sno,
    section:req.body.section,
    title:req.body.title,
    q1: req.body.q1,
    q2: req.body.q2,
    q3:req.body.q3,
    q4:req.body.q4
    })
    users
    .save(users)
    .then(users=>{
        res.redirect("/assign")
    })
    .catch(err=>{
       res.render("assignments/error1");
    })
});

app.get("/assign_del",(req,res)=>{
    res.render("assignments/del");
})
app.get("/error1",(req,res)=>{
    res.render("assignments/error1");
})
app.get("/error3",(req,res)=>{
    res.render("assignments/error3");
})

//update course 
app.get("/assign_update/:id",(req,res)=>{
    const id= req.params.id;
    Assigndb.findById(id).then(users=>{
        if(!users){
            res.render("assignments/error3");
        }
        else{
            res.render("assignments/update",{users})
    }   
}).catch(err=>{
    res.render("assignments/error1");
})})
   
app.post("/assign_update/:id",(req,res)=>{
    if(!req.body){
        res.render("assignments/error1")
    }
    
    const id= req.params.id;
    Assigndb.findByIdAndUpdate(id,req.body,{useFindAndModify:false}).then(data=>{
        if(!req.body){
            res.render("assignments/error1");
        }
        res.redirect("/assign");
    })
  
});

//delete course

app.get("/assign_del/:id",(req,res)=>{
    const id=req.params.id;
    Assigndb.findById(id).then(users=>{
        if(!users){
            res.render("assignments/error3");
        }
        else{
            res.render("assignments/del",{users})
    }   
}).catch(err=>{
    res.status(500).send({message:`Couldn't delete user with id ${id}`});
})})

app.get("/assign_delete/:id",(req,res)=>{
    const id = req.params.id;

    Assigndb.findByIdAndDelete(id).then(data=>{
        if(!data){
            res.render("assignments/error3");
        }
        else{
            // res.send({
            //     message:`User with ${id } id deletd successfully`
            // });
            res.redirect("/assign");
        }
    }).catch(err=>{
        res.render("assignments/error1");    })
})

app.listen(5500);
