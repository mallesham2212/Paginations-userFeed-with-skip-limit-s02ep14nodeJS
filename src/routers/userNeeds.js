const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const user = require("../models/user");
const { ConnectionRequestModel } = require("../models/connectionRequest");


const userRouter = express.Router();



userRouter.get("/requests/received", userAuth, async (req, res) => {


    try {
        const loggedInUser = req.user;
        const isValidRequest = await ConnectionRequestModel.find({
            status: "intrested",
            toUserId: loggedInUser._id
        }).populate("fromUserId",["firstName" , "lastName"])
        
        res.send(isValidRequest)


    } catch (error) {
        res.send("Error" + error.message)
    }


})


userRouter.get("/requests/connections" ,userAuth , async (req,res) =>{
    try {
        const loggedInUser = req.user;
        const connectedUsers = await ConnectionRequestModel.find({
            status:"accepted",

            $or:[
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
            
        }).populate("toUserId" ,["firstName","lastName"])
          .populate("fromUserId" ,["firstName","lastName"]);


        const data = connectedUsers.map((row ) =>{
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })  

        res.send(data);

    } catch (error) {
        
    }
})



// Pagination in feed Api 

userRouter.get("/request/feed" ,userAuth , async (req,res) =>{
    try {
        const loggedInUser = req.user;

        const pages= parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        const skip = (pages-1) * limit;

    

        const hideUsers = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")


        const hideUsersFeed = new Set();

        hideUsers.forEach((element) => {
            hideUsersFeed.add(element.fromUserId.toString());
            hideUsersFeed.add(element.toUserId.toString());
        });

  
        
        const showUsers = await user.find({
           $and :[
            {_id : { $nin : Array.from(hideUsersFeed) }},
            {_id: {$ne : loggedInUser._id }}
           ]
        }).select("firstName lastName")
        .skip(skip)
        .limit(limit)

        
        res.send(showUsers);

    } catch (error) {
        res.json({
            message:"Request Invalid"
        })
    }
})

module.exports = { userRouter };


