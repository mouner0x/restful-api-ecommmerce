const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../image"))
    },
    filename:function(req,file,cb){
        if(file){
            cb(null,new Date().toISOString().replace(/:/g,"-")+file.originalname);
        }
        else{
            cb(null,false)
        }
    }
})



const photoUpload = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb({message:"Unsupported File Format"},false)
        }
    },
    limits:{fieldSize:1024 * 1024 *10}

})


module.exports = {
    photoUpload
}