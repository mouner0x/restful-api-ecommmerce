const mongoose = require("mongoose");
const joi = require("joi");
const schema = mongoose.Schema;

const categorySchema = new schema({

    name: {
        type: String,
        required: [true, "category required"],
        unique: [true,"category must be unique"],
        minlength:[3,"too short category name"],
        maxlength:[32,"too long category name"],     
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:Object,
        default:{
            url:null,
            public_id:null
        }
    }

},{timestamps:true})

const categoryModel = mongoose.model("category", categorySchema);




function validateCreateCategory(obj) {
    const schema = joi.object({
    
        name:joi.string().min(3).max(32).required(),
        slug:joi.string()

    })
    return schema.validate(obj);
}



function validateUpdateCategory(obj) {
    const schema = joi.object({
        category:joi.string().min(3).max(32),
        slug:joi.string()
    })
    return schema.validate(obj);
}


module.exports = {
    validateCreateCategory,validateUpdateCategory,categoryModel
}