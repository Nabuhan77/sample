const express = require("express");
const mongoose = require("mongoose");
//const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const PORT=8888;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
mongoose.connect("mongodb://127.0.0.1:27017/freqvault")
.then(()=>{console.log("connected to mongodg")})
.catch((error)=>{console.log("failed to connect mongodb")});

app.use("/api/admin",adminRouter);
app.use("/api/user",userRouter);
app.listen(PORT,()=>console.log("server started !"));