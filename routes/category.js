const express = require("express");
const router = express.Router();
const {createCategory,updateImage,getAllCategory,deleteSpecificCategory,updateSpecificCategory,getSpecificCategory} = require("../controller/category")
const  photoUpload = require("../middleware/photoUpload")



router.route("/").
post(photoUpload.photoUpload.single("image"),createCategory).
get(getAllCategory)

router.route("/:id").
get(getSpecificCategory).put(photoUpload.photoUpload.single("image"),updateImage).put(updateSpecificCategory).
delete(deleteSpecificCategory)


module.exports = {
    categoryPath:router
}