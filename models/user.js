const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    }
},{timestamps : true });

const user = mongoose.model("user",userSchema);
module.exports = user;