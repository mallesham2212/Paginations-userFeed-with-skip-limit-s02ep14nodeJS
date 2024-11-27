const mongoose= require("mongoose");

const connectDb = async () => {
    await mongoose.connect(
      "mongodb+srv://puttimallesham22:passwordDB@namstenodetest.qabzq.mongodb.net/devTinder");
};

module.exports = connectDb;




