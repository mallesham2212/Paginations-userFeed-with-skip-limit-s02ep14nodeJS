
const { validateEditData ,validateEmail} = require("../helpers/validator");
const { userAuth } = require("../middleware/userAuth");
const user = require("../models/user");
const bcrypt =require("bcrypt");
const validator=require("validator");

const express=require("express");
const profileRouter = express.Router();
profileRouter.get("/profile/view",userAuth, async (req, res) => {
	try {
		const user=req.user;
		res.send(user);	
	} catch (error) {
		res.status(400).send("ERROR  :  " + error.message);
	}
})

profileRouter.patch("/profile/edit",userAuth , async (req,res) =>{
    

	try {
		if(!validateEditData(req)){
			throw new Error("Invalid edit data");
		}
		const loggedInUser=req.user;
		const editUser =req.body;

		console.log(loggedInUser);
		
		Object.keys(editUser ).forEach(key => {
			// Update loggedInUser  properties with values from editUser 
				loggedInUser [key] = editUser [key];
		});

		console.log(loggedInUser);
		

		await loggedInUser.save();
	} catch (error) {
		res.status(400).send("ERROR  :"+ error.message );
	}

	const newUser=req.body;
   
    

    
})

profileRouter.patch("/profile/editPassword" ,userAuth ,async (req,res) =>{
	try {
		if( ! await validateEmail(req)){
			throw new Error("Invalid Credentials");
		}
		const user = req.body;
		if(!validator.isStrongPassword(user.newPassword)){
			throw new Error("New Password is Not Strong");
		}
		if(user.newPassword === user.passWord){
			throw new Error("Enter Different password from Previous password");	
		}
		const newPasswordHash = await bcrypt.hash(user.newPassword,10);
		const loggedInUser = req.user;
		loggedInUser.passWord= newPasswordHash;
		await loggedInUser.save();
		res.send("password edited succesfully")
	} catch (error) {
		res.status(404).send("ERROR  :" + error.message)
	}
})

module.exports = profileRouter;