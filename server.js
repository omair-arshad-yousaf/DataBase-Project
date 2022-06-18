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

//find student by namee 
app.get("/student/find",(req,res)=>{
    res.render("students/find");
})
app.post("/student/result",async(req,res)=>{
    try{
    console.log(req.body.name);
    const name = req.body.name;
        const users = await Studentdb.findOne({name:name});
            if(users.name===name){
                res.render("students/found",{users})
            }
            else{
               res.send("no data found");
        }}
    catch(err){
        res.send("no data found!!!!")
    }})

    //find student by id
    app.get("/student/find_id",(req,res)=>{
        res.render("students/find_id");
    })
    app.post("/student/find_id",async(req,res)=>{
        try{
        const sno = req.body.sno;
            const users = await Studentdb.findOne({sno:sno});
                if(users.sno===sno){
                    res.render("students/found_id",{users})
                }
                else{
                   res.send("no data found");
            }}
        catch(err){
            res.send("no data found!!!!")
        }})


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
        sno:req.body.sno,
    name: req.body.name,
    email: req.body.email,
    password : req.body.password,
    confirmpass: req.body.confirmpass,
    age: req.body.age,
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
    Teacherdb.find()
    .then(users=>{
        res.render("teachers/teacher",{users})
    })
.catch(err=>{
    res.status(500).send({message:err.message||"Error finding Data"});
})}
})

//create teacher
app.get("/teacher/create", (req,res)=>{
    res.render("teachers/create")
})
app.post("/teacher/create",(req,res)=>{
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
//find teacher by namee 
app.get("/teacher/find",(req,res)=>{
    res.render("teachers/find");
})
app.post("/teacher/result",async(req,res)=>{
    try{
    console.log(req.body.name);
    const name = req.body.name;
        const users = await Teacherdb.findOne({name:name});
            if(users.name===name){
                res.render("teachers/found",{users})
            }
            else{
               res.send("no data found");
        }}
    catch(err){
        res.send("no data found!!!!")
    }})

    //find teacher by id
    app.get("/teacher/find_id",(req,res)=>{
        res.render("teachers/find_id");
    })
    app.post("/teacher/find_id",async(req,res)=>{
        try{
        const id = req.body.sno;
            const users = await Teacherdb.findOne({sno:id});
                if(users.sno===id){
                    res.render("teachers/found_id",{users})
                }
                else{
                   res.send("no data found");
            }}
        catch(err){
            res.send("no data found!!!!")
        }})
app.get("/error1",(req,res)=>{
    res.render("teachers/error1");
})
app.get("/error2",(req,res)=>{
    res.render("teachers/error2");
})

//find student
// app.get("/student/find",controller.find);
// app.get("/student/find/:id",controller.findbyId)

//update teacher 
app.get("/teacher/update/:id",(req,res)=>{
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
    
app.post("/teacher/update/:id",(req,res)=>{
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

//delete teacher
app.get("/teacher/delete/:id",(req,res)=>{
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
