const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require('../middleware/userAuth');
const { ConnectionRequestModel } = require("../models/connectionRequest");
const user = require("../models/user");


profileRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
	try {
		const status = req.params.status;
		const fromUserId = req.user._id;
		const toUserId = req.params.userId;
		const isValidUser = await user.findById(toUserId);
		if (!isValidUser) {
			return res.status(400).send("Invalid toUserId");
		}
		const isUserExist = await ConnectionRequestModel.findOne({
			$or: [
				{ fromUserId, toUserId },
				{ fromUserId: toUserId, toUserId: fromUserId }
			]
		})
		if (isUserExist) {
			return res.status(400).send("user already Exist");
		}
		const allowedStatus = ["ignored", "intrested"];
		const isValid = allowedStatus.includes(status);


		if (fromUserId.equals(toUserId)) {
			return res.status(400).send("Invalid Status Type same User");
		}

		if (!isValid) {
			return res.status(400).send("Invalid Status Type");
		}

		const connectionRequest = new ConnectionRequestModel({
			fromUserId, toUserId, status
		})
		const data = await connectionRequest.save();

		res.json({
			message: "send ",
			data
		})

	} catch (error) {
		res.status(402).send("ERROR + :" + error.message)
	}

})



profileRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {


	try {




		const loggedInUser = req.user;
		const { status, requestId } = req.params;

		const allowedFields = ["accepted", "rejected"];
		if (!allowedFields.includes(status)) {
			return res.status(400).json({
				message: "Invalid status"
			})
		}
		const isValidRequest = await ConnectionRequestModel.findOne({
			status: "intrested",
			toUserId: loggedInUser._id,
			_id: requestId
		})

		if (!isValidRequest) {
			return res.status(404).send("Invalid Request")
		}

		isValidRequest.status = status;

		const data = await isValidRequest.save();


		res.json({
			message: "Accepted Your Request",
			data
		})

	} catch (error) {
		res.status(400).send("Invalid Request")
	}
})


module.exports = profileRouter;