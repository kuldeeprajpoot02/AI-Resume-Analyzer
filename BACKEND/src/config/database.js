const mongoose = require("mongoose");

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error(
            "MONGO_URI is missing. Please configure it in your .env file."
        );
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully");
        console.log("DATABASE NAME:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = connectToDB;