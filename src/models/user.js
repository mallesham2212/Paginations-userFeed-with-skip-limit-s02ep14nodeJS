const mongoose = require("mongoose");
const validator=require("validator");

const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required:true,
        trim: true,
    },
    age:{
      
        type:Number,
        min:18
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email is not correct");
            }
        }
    },
    passWord: {
        type: String,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("password is too weak");
            }
        }
    },
    gender:{
        type:String,
        validate(val){
            if(!["male","female","others"].includes(val)){
                throw new Error("Gender is Not Valid");
            }
        }
    },
    photourl:{
        type:String,   
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("url path is correct");  
            }
        }
    },
    skills:{
        type:[String],
        validate(val){
            if(val.length >10){
                throw new Error("skill cant exceed 10");
            }
        }
    }
},{timestamps:true});




userSchema.methods.getJWT =async function(){
    const user = this;
    const jToken = await jwt.sign({ _id: user._id }, "Mallesham@2212" ,{expiresIn:"1d"} );

    return jToken;

}

userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const user = this;
    const passWordHash=user.passWord

    const isUserExist = await bcrypt.compare(passwordInputByUser, passWordHash);

    return isUserExist;

}


// Create the User model
module.exports =mongoose.model("User ", userSchema);
