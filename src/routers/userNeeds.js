const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const user = require("../models/user");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const isValidRequest = await ConnectionRequestModel.find({
            status: "intrested",
            toUserId: loggedInUser._id
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message: "Data fetched successfully",
            data: isValidRequest,
        });

    } catch (error) {
        res.send("Error" + error.message)
    }
})
userRouter.get("/requests/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectedUsers = await ConnectionRequestModel.find({
            status: "accepted",

            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]

        }).populate("toUserId", USER_SAFE_DATA)
            .populate("fromUserId", USER_SAFE_DATA);


        const data = connectedUsers.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json(data);

    } catch (error) {
        res.status(404).message("something went wrong")
    }
})
// Pagination in feed Api
userRouter.get("/request/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const pages = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 100;
        const skip = (pages - 1) * limit;
        const hideUsers = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")


        const hideUsersFeed = new Set();

        hideUsers.forEach((element) => {
            hideUsersFeed.add(element.fromUserId.toString());
            hideUsersFeed.add(element.toUserId.toString());
        });
        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit)
        res.json({ data: users });

    } catch (error) {
        res.json({
            message: "Request Invalid"
        })
    }
})

module.exports = { userRouter };


