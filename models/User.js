const mongoose = require("mongoose");
const schema = mongoose.Schema;
const joi = require("joi");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({path:"config.env"})
const secret_key = process.env.secret_key;
const userSchema = new schema({

    fristName:{
        type:String,
        minlength:2,
        maxlength:100,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        minlength:2,
        maxlength:100,
        required:true,
        trim:true
    },
    email:{
        type:String,
        maxlength:100,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate:{
            validator:function(value){
                return validator.isEmail(value)
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validate:{
            validator:function(value){
                return validator.isStrongPassword(value)
            },
            message: props=> `please type a strong password ${props.value}`
        }
    },
    profilePhoto:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            public_id:null
        }
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number,
        require:true,
        min:8,
        max:12
    },
    googleAtuh:{
        id:String,
        email:String
    },
    city:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }


},{timestamps:true})


userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.secret_key, { expiresIn: "1d" });
};

const userModel = mongoose.model("user",userSchema)

function validateLoginUser(obj){
    const schema = joi.object({
        email:joi.string().max(100).lowercase().trim().email(),
        password:joi.string().required().trim()

    })
    return schema.validate(obj);
}




function validateRegisterUser(obj){
    const schema = joi.object({
        email: joi.string().max(100).lowercase().trim().email(),
        password: joi.string().required().trim().min(8).custom((value, helpers) => {
            if (!validator.isStrongPassword(value)) {
                return helpers.message('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            }
            return value;
        }),
        fristName:joi.string().min(2).max(100).required().trim(),
        lastName:joi.string().min(2).max(100).required().trim()
    });

    return schema.validate(obj);
}

module.exports = {
    validateLoginUser,validateRegisterUser,userModel
}