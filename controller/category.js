const { validateUpdateCategory, validateCreateCategory, categoryModel } = require("../models/Category")
const expressasynchandler = require("express-async-handler");
const { cloudinaryRemoveimage, cloudinaryUploadimage } = require("../utils/cloudinary")
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { name } = require("ejs");



const createCategory = expressasynchandler(

    async (req, res) => {

        const { error } = validateCreateCategory(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { name, slug } = req.body;

        const imagepath = path.join(__dirname, `../image/${req.file.filename}`)
        const data = await cloudinaryUploadimage(imagepath)
        const createNewCategory = await new categoryModel({
            name, slug: slugify(name), image: {
                url: data.secure_url,
                public_id: data.public_id
            }
        })
        await createNewCategory.save();
        res.status(201).json({ data: createNewCategory })
        fs.unlinkSync(imagepath);

    }
)



const getAllCategory = expressasynchandler(
    async (req, res) => {

        const page = req.query.page * 1 || 1; // Convert string to number
        const limit = req.query.limit * 1 || 5;
        const skip = (page - 1) * limit;

        const categories = await categoryModel.find({}).skip(skip).limit(limit);
        res.status(200).json({ result: categories.length, page, data: categories })
    }
)






const getSpecificCategory = expressasynchandler(


    async (req, res) => {

        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category Not Found" })
        }
        res.status(200).json(category);


    }


)



const updateSpecificCategory = expressasynchandler(

    async (req, res) => {

        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category Not Found" })
        }

        const id = req.params.id;
        const updateCategory = await categoryModel.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                slug: slugify(name)

            }
        }, { new: true })


        res.status(200).json({  updateCategory })

    }

)



const updateImage = expressasynchandler(

    async (req,res)=>{
        if(!req.file){
            return res.status(400).json({message:"No File Provided"})
        }

        const category = await categoryModel.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category Not Found"})
        }
        await cloudinaryRemoveimage(category.image.public_id);
        const imagePath = path.join(__dirname,`../image/${req.file.filename}`)
        const data = await cloudinaryUploadimage(imagePath)

        const newImage = await categoryModel.findByIdAndUpdate(req.params.id,{
            $set:{
                image:{
                    public_id:data.public_id,
                    url:data.secure_url
                }
            }
        },{new:true})
        
        res.status(200).json(newImage);
        fs.unlinkSync(imagePath)

    }

)





const deleteSpecificCategory = expressasynchandler(

    async (req, res) => {

        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category Not Found" })
        }

       await cloudinaryRemoveimage(category.image.public_id)
        await categoryModel.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Category Has Been Deleted" })


    }

)







module.exports = {
    createCategory, updateImage,deleteSpecificCategory, getAllCategory, getSpecificCategory, updateSpecificCategory
}