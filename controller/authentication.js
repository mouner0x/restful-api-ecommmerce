const bcryptjs = require("bcryptjs");
const {validateLoginUser,validateRegisterUser,userModel} = require("../models/User");
const {tokenModel} = require("../models/Verifytoken")
const asynchandler = require("express-async-handler");
const crypto = require("crypto")
const {sendEmail} =require("../utils/sendMail")
const path = require("path");
const fs = require("fs");
const moment = require('moment');
const emailTemplate = path.join(__dirname, "../views/confirmemail.ejs")
const templateContent = fs.readFileSync(emailTemplate, 'utf-8');
const ejs = require("ejs");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;  //You only load a specific strategy from Passport.js (google)



















const registerUser = asynchandler(
    async (req,res)=>{

        const {error} = validateRegisterUser(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }

        const user = await userModel.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({message:"User Already Exist, Please Login"})
        }

        let {password,fristName,lastName,email,phone} = req.body;
        const salt = await bcryptjs.genSalt(6);
        password = await bcryptjs.hash(req.body.password,salt);

        const newUser = await new userModel({
            password,fristName,lastName,email,phone
        })        


        await newUser.save();
        const expiresAt = moment().add(1, "hours").toDate();
        const token = await new tokenModel({
            user:newUser._id,
            token:crypto.randomBytes(32).toString("hex"),
            expireAt:expiresAt

        })

        await token.save();

        const templateDate = {
            name:newUser.fristName,
            url:`http://localhost:8080/api/vi/auth/${newUser._id}/verify/${token.token}`
        }
        const renderContent = ejs.render(templateContent,templateDate)
       

        await sendEmail(newUser.email,"Verify Your Email Account",renderContent);
        res.status(201).json({ message: "We sent to you an email, please verify your email address" })


    }
)







const verifyUserAccount = asynchandler(
    async (req,res)=>{
        const user = await userModel.findById(req.params.id);
        if(!user){
            return res.status(400).json({message:"User Not Found, Please Try again"})
        }

        const userToken = await tokenModel.findOne({
            user:user._id,
            token:req.params.token,
        })

        if(!userToken){
            return res.status(400).json({message:"User Not Found, Please Try again"})
        }
        if (userToken.expireAt< new Date()) {
            return res.status(400).json({ message: "Activation link has expired" });
        }
        user.isAccountVerified = true;
        await user.save();
        await userToken.deleteOne();
        res.status(200).json({ message: "Account verified successfully" });

    }
)





const loginUser = asynchandler(
    async (req,res)=>{
        const {error} = validateLoginUser(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message});
        }

        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({message:"Incorrect Password Or Email"})
        }

        const expiresAt = moment().add(1, "hours").toDate();
        const isPasswordMatch = await bcryptjs.compare(req.body.password,user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Incorrect Password Or Email" });
        }
        if(!user.isAccountVerified){
            let newToken = await tokenModel.findOne({
                user:user._id
            })
            if(!newToken){
                newToken = await new tokenModel({
                    user:user._id,
                    token:crypto.randomBytes(32).toString("hex"),
                    expireAt:expiresAt
                })
                await newToken.save();
            }

            const templateDate = {
                name:user.fristName,
                url:`http://localhost:8080/api/vi/auth/${user._id}/verify/${newToken.token}`
            }
            const renderContent = ejs.render(templateContent,templateDate)
            await sendEmail(user.email,"Verify Your Email Account",renderContent);
            return res.status(400).json({ message: "please active your account, we sent to you an email" })
        }

        const token = user.generateToken()
        res.status(200).json({
            token,
            isAdmin:user.isAdmin,
            id:user._id
        })

    }
)






module.exports = {
    registerUser,verifyUserAccount,loginUser
}