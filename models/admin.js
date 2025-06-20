const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    }
},{timestamps : true }
);

const admin = mongoose.model("admin",adminSchema);
module.exports = admin;