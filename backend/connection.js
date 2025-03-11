const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URI;

mongoose.connect(url)
.then((result) => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err.message);
});

module.exports = mongoose;