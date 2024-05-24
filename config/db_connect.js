const mongoose = require("mongoose");
const dotenv = require("dotenv").config({path:"config.env"})
const db_url = process.env.db_url


async function connectToDb(){

    try{

        mongoose.connect(db_url)
        console.log(`dataBase connect on port ${27017}`)

    }
    catch(error){
        console.log(error)
    }

}

module.exports = connectToDb;