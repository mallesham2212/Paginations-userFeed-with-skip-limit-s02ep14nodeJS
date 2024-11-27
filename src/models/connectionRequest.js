
const { mongoose } = require("mongoose");
const User = require("./user");


const connectionRequestModel = new mongoose.Schema ({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : User
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    status:{
        type:String,
        enum:{
            values:[
                "accepted","ignored","intrested","rejected"
            ],
            message: `{VALUE} is correct status type`
        }
    }

},{timestamps:true});
const ConnectionRequestModel = new mongoose.model("connectionModel",connectionRequestModel)

module.exports ={ ConnectionRequestModel};