const validator=require("validator");

const user = require('../models/user');
const bcrypt =require("bcrypt")

const validateSignUpData = (req)=>{
    const {firstName,lastName,passWord,Email}=req.body;
    if(!firstName  || !lastName){
        throw new Error("Name is not Valid");
    }
    else if(!validator.isEmail(Email)){
        throw new Error("Enter Valid Email");     
    }
    else if(!validator.isStrongPassword(passWord)){
        throw new Error("Enter a Strong Password");
    }

}

const validateEditData= (req) =>{
    const editUser=req.body;
	const allowedFields= ["firstName","lastName", "Email", "age" ,"skills" , "gender" , "photoUrl" ,"about"];
	const isValidEdit = Object.keys(editUser).every((field) => allowedFields.includes(field) );
    return isValidEdit;
}
const validateEmail = async (req) =>{
    const loggedInUser= req.user;
    const edituser =req.body;
    const isMatch = await bcrypt.compare(edituser.passWord, loggedInUser.passWord);
    const isValidRequest= (loggedInUser.Email === edituser.Email);
    return isMatch && isValidRequest;
}
module.exports={validateSignUpData , validateEditData , validateEmail};