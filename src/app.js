const express = require('express')
const connectDb = require('./config/database')

const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const user = require('./models/user');
const { userAuth } = require('./middleware/userAuth');



const authRouter =require("../src/routers/authRouter");
const profileRouter =require("../src/routers/profile")
const requestRouter =require("../src/routers/request");
const { userRouter } = require('./routers/userNeeds');

const app = express()

app.use(express.json());
app.use(cookieParser());



app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)




// This is how we can get the data from database with specify email get request

//This is how we can update in the database 
app.get("/feed", async (req,res)=>{
	try {
		const users=await User.find({}); 
		res.send(users)
	} catch (error) {
		res.send("no data available")
	}
})

// app.patch("/user",async (req,res)=>{
// 	const userId=req.body.userId;
// 	here body will replace all the actual update you want
// 	const body=req.body;
// 	console.log(userId);
// 	try {
// 		const users=await User.findByIdAndUpdate({_id:userId}, body);
// 		console.log(users);
// 		res.send(users);
// 		console.log("updated succesfully");		
// 	}  catch (error) {
// 		res.status(404).send("user not found"+err.message());
// 	}
// } )


// This is how we can delete the required user from database
app.delete("/user", async (req, res) => {
	try {
		const { Email, passWord } = req.body;
		const isEmailExist = await User.findOne({ Email: Email });
		if (!isEmailExist) {
			throw new Error("Invalid credentials");
		}
		const isPasswordExist = await bcrypt.compare(passWord, isEmailExist.passWord);
		if (isPasswordExist) {
			const users = await User.findOneAndDelete({ Email: Email });
			res.send("deleted your Account");
		}
		else {
			res.status(404).send("Invalid Credentials");
		}
	} catch (error) {
		res.status(404).send("ERROR   :" + error.message);
	}
})
// app.delete("/user",async (req,res)=> {
// 	const userid=req.body.Id;
// 	console.log(userid);
// 	try {
// 		const users=await User.findByIdAndDelete(userid);
// 		console.log(users);
// 		res.send(users);
// 	}  catch (error) {
// 		res.status(404).send("user not found"+err.message());
// 	}
// })



// Login API  


connectDb().then(() => {
	console.log("connected to database");
	app.listen(4000, () => {
		console.log("server connecting...");
	})
}).catch((err) => {
	console.error("data base cannot connected");
})


