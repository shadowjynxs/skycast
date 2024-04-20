// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://shadowjynxs:(m(CvCzm822)m)@artportfolio.zpvkz6z.mongodb.net/?retryWrites=true&w=majority&appName=artportfolio', {

        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;