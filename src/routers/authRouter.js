const { validateSignUpData } = require("../helpers/validator")
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require('../middleware/userAuth');

const user = require('../models/user');


const express=require("express");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

	try {
		// first we need to validate the Data
		validateSignUpData(req);
		
		const { firstName, lastName, passWord, Email } = req.body;

		// Then we need to Encrypt the password of User . install bcrypt library

		const passWordHash = await bcrypt.hash(passWord, 10);

		
		// Creating new Instance of User with required fields
		 
		const user = new User({
			firstName,
			lastName,
			Email,
			passWord: passWordHash
		});


		await user.save();
		res.send("user added succesfully")
	} catch (error) {
		res.status(404).send("User  not found: " + error.message);
	}
})

authRouter.post("/login", async (req, res) => {
	try {
		const { Email, passWord } = req.body;
		const user = await User.findOne({ Email: Email });
		if (!user) {
			throw new Error("Invalid Credentials");
		}
		const isUserExist = await user.validatePassword(passWord);
		if (isUserExist) {
			// Here we need to create to JWT token
		
			const jToken= await user.getJWT();
			// Log the user ID			
			res.cookie("token", jToken);
			res.send("Login Successful");
		}
		else {
			res.send("Invalid Credentials");
		}
	} catch (error) {
		res.status(404).send("ERROR   :" + error.message);
	}
})


authRouter.post("/logout" , userAuth, async (req,res) =>{
	
    res.cookie("token" ,null, {expires: new Date(Date.now()) })
	res.send("logout successfully")
})




module.exports= authRouter;