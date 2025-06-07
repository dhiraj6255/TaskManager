const mongoos = require("mongoose");

const connectDB = async () => {
    try {
        await mongoos.connect(process.env.MONGO_URI, {});
        console.log("MongoDb connected");
    } catch (error) {
        console.log("Error connecting to MongoDb", error)
        process.exit(1);
    }
};

module.exports = connectDB;