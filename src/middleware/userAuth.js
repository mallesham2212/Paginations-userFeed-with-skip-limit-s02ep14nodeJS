const jwt=require("jsonwebtoken");
const User = require("../models/user");

const userAuth =  async (req, res ,next)  =>{

    // Checking The token exist or not in every API request 
   try
   { 
    const {token}= req.cookies;
    const decodedMessage= await jwt.verify(token,"Mallesham@2212");
    if(!decodedMessage){
        throw new Error("Invalid Token");
    }
    const {_id}=decodedMessage;
    const user= await User.findById({_id:_id});
    if(!user){
        throw new Error("Invalid Token");
    }
        req.user=user;
        req.token=token;
        next();
    }
    catch(error){
        res.status(402).send("ERROR   : "+ error.message)
    }

}
module.exports={userAuth};