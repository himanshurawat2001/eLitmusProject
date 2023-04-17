import express from 'express';
import path from 'path';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


mongoose.connect("mongodb+srv://Shubhamy:21jumlcpBeAHUxbx@cluster0.ywnqbfq.mongodb.net/ecommerce",{
    dbName : "backend",
}).then(() => console.log("mongodb connected"))
.catch((err) => console.log(err));



// const connectDB=async()=>{
//     try {
//      const conn=await mongoose.connect(process.env.MONGO_URL);
//      console.log(`connected to mongoDB database ${conn.connection.host}`.bgMagenta.white )
//     } catch (error) {
//      console.log(`error in mongoDb ${error}`.bgRed.white);
//     }
//  }
 
const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const User = mongoose.model("User",userSchema);


const app = express();

//users naam ki array database me push karne ke liye
// const users = [];
//Using middleware
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
//setting up view engine
app.set('view engine', 'ejs'); 

const isAuthenticated = async(req,res,next) => {
    const {token} = req.cookies;
    if(token){

        const decoded = jwt.verify(token,"himanshurawat");
        req.user =await User.findById(decoded._id);
        next();
    }
    else{
        res.redirect("/login");
    }
};



app.get("/",isAuthenticated,(req,res)=>{

    res.render("logout",{name : req.user.name});




    // res.json({
    //     success : true,
    //      products : []
    // });
    //  const pathlocation = path.resolve();
    // res.sendFile(path.join(pathlocation,"./index.html"));

//  const {token} = req.cookies;

//  if(token){
//     res.render("logout");
//  }
//     else{
//     res.render("login");
//     }
});

app.get("/login",(req,res)=>{
    res.render("login");
}); 

app.get("/game",(req,res)=>{
    res.render("game");
}); 

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
let user = await User.findOne({email})
if(!user) return res.redirect("/register");

 const isMatch = await bcrypt.compare(password,user.password);

 if(!isMatch) return res.render("login",{email,message:"Invalid Credentials"});

 const token = jwt.sign({_id:user._id},"himanshurawat");
 // console.log(token);

 res.cookie("token",token,{
     httpOnly : true, expires:new Date(Date.now() + 60*1000)
 });
 res.redirect("/");
});


app.post("/register",async(req,res)=>{
const{name ,email, password} = req.body;

    let user = await User.findOne({email});
    if(user){
      return  res.redirect("/login");
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    
    user = await User.create({
        name,email,password: hashedPassword
    });

    const token = jwt.sign({_id:user._id},"himanshurawat");
    // console.log(token);

    res.cookie("token",token,{
        httpOnly : true, expires:new Date(Date.now() + 60*1000)
    });
    res.redirect("/");
});

app.get("/logout",(req,res)=>{
    res.clearCookie("token",null,{
        httpOnly : true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});

// app.get("/add",async(req,res)=>{
//    await Message.create({name : "imam Vellani",email : "imvellani@d3lata.org"});
//         res.send("add Noice");
//     });

// app.get("/success",(req,res)=>{
//     res.render("Success");
// })

// app.post("/contact",async(req,res)=>{
//     // console.log(req.body);
//     const {name,email} = req.body;
//     await Message.create({name,email});
//     //  res.render("Success");
//     res.redirect("/success");
// })

// app.get("/users",(req,res)=>{
//     res.json(users);
// })

app.listen(5000,() => {
    console.log("Server is running on port 5000");
})


















//VIDEO KA FIRST PART

// import http from "http";
// import { generateLovePercentage } from "./features.js";

// console.log(generateLovePercentage());

// const server = http.createServer((req, res) => {
// if(req.url === "/") {
//   res.end("Welcome to our home page");
// }

// else  if(req.url === "/about") {
//     res.end(`<h1> Love is ${generateLovePercentage()} </h1>`);
//     }

// else if(req.url === "/contact") {
//     res.end("Here is our contact page");
//     }

// else {
//     res.end(`
//     <h1>Oops!</h1>
//     <p>We can't seem to find the page you are looking for</p>
//     <a href="/">Back Home</a>
//     `);
// }    

// });

// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });