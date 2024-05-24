const mongoose = require("mongoose");
const schema = mongoose.Schema;
const joi = require("joi");

const tokenSchema = new schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expireAt:{
        type:Date,
        required:true
    }
})


const tokenModel = mongoose.model("token",tokenSchema);

module.exports = {
    tokenModel
}