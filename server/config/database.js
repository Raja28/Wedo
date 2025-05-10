const mongoose = require('mongoose')
require('dotenv').config()

exports.connectDB = async () =>{
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        if (connection) {
            console.log("WeDo DB connected");
        }
    } catch (error) {
        console.log("Error connecting to WeDo DB");
        console.log(error);
    }
}