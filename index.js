const express= require("express");
const app=express();
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const JWT_SECRET="iwintoday";

mongoose.connect("mongodb+srv://prajwalnawale:iwin@cluster0.jigxzhh.mongodb.net/todo-app")

const{UserModel,TodoModel}=require("./db");

app.use(express.json());// used to parse json body


app.post("/signup",async (req ,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;

    await UserModel.create({
        email:email,
        password:password,
        name:username
    })

    res.json({
        message:"User registered successfully"
    })

});

app.post("/signin",async  (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    const user=await UserModel.findOne({
        email:email,
        password:password

    })

    if(user){
        const token=jwt.sign({
            id:user._id.toString(),
        },JWT_SECRET);

    res.json({
        message:"User signed in successfully",
        token:token
    })
    } else{
        res.status(403).json({
            message:"Invalid email or password"
        })
    }


});

app.post("/todo",(req,res)=>{
    const userId=req.userId;
    res.json({
        userId:userId
    })

});

app.get("/todos",(req,res)=>{
    const userId=req.userId;
    res.json({
        userId:userId
    })

});

function auth(req,res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,JWT_SECRET);
    if(decodedData){
        req.userID=decodedData.id;
        next();
    }  
    else{
        res.status(403).json({
            message:"Invalid token"
        })
    }

}
app.listen(3000);

