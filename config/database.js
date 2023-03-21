require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.DATABASE;

async function connect() {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        const con = await mongoose.connect(connectionString, options);
        if(!con){
            throw new Error("Cannot Connect To Database");
        }
        else{
            console.log("Database connected");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect }