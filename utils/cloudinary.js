const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config({path:"config.env"});



cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})


async function cloudinaryUploadimage(filename){

    try{

        const data = await cloudinary.uploader.upload(filename,{
            resource_type:"image"
        })
        return data;

    }catch(error){
        return error;
    }

}


async function cloudinaryRemoveimage(image_public_id){

    try{

        const result = await cloudinary.uploader.destroy(image_public_id,{
            resource_type:"image", invalidate: true
        })
        return result;
    }
    catch(error){
        return error;
    }

}




module.exports = {
    cloudinaryRemoveimage,cloudinaryUploadimage
}