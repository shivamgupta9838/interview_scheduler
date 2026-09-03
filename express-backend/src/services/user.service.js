const userModel = require("../models/user.model");
const ApiError= require("../../shared/errors/apiError");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");
const logger = require("../logger");
const refreshTokenService = require("./refreshToken.service");

async function getallusers(query = {}){
    const page= Number(query.page) || 1;
    const limit= Number(query.limit) || 5;
    const sort= query.sort || "role";
    const skip= (page-1) * limit;

    return userModel.find(query).sort({[sort]:1}).skip(skip).limit(limit);
}

async function getUser(id){
    return userModel.findById(id);
}

async function createuser(user){

    return userModel.create(user);
}

async function updateuser(id,data){

    return userModel.findByIdAndUpdate(
        id,
        data,
        {returnDocument: "after"}
    );
}

async function deleteuser(id) {
    return userModel.findByIdAndDelete(id);
}

async function loginUser(data){
    const user= await userModel.findOne({
        email: data.email
    });

    if(!user)
        throw new ApiError(401, "Invalid email or Password");

    const isMatch= await bcrypt.compare(data.password,user.password);

    if(!isMatch)
        throw new ApiError(401, "Invalid email or Password");
        
    const accessToken= jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        // {
        //     expiresIn: "24h"
        // }
    );

    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d"
        }
    );

    await refreshTokenService.createRefreshToken(
        user._id,
        refreshToken
    );

    return {accessToken, refreshToken};
}

module.exports={
    getallusers, createuser, updateuser, deleteuser, loginUser, getUser
}