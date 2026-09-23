const userModel = require("../models/user.model");
const ApiError= require("../../shared/errors/apiError");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");
const logger = require("../logger");
const refreshTokenService = require("./refreshToken.service");
const permissions = require("../auth/permissions");
const { getUserReadScope } = require("../auth/scope");
const { getDatatableFilters } = require("../shared/utils/datatable");

async function getallusers(query, user){
    const scope = getUserReadScope(user);

    return getDatatableFilters({
        model: userModel,
        query,
        searchFields: [
            "name",
            "email",
        ],
        filter: scope
    });
}

async function getApiUsers(query, user){
    const scope = getUserReadScope(user);

    const filters = {
        ...scope,
        ...query,
    };

    return userModel.find(filters).select("_id name email");
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

    // const isMatch= await bcrypt.compare(data.password,user.password);
    const isMatch= data.password == user.password;

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

    // const refreshToken = jwt.sign(
    //     {
    //         id: user._id
    //     },
    //     process.env.JWT_REFRESH_SECRET,
    //     {
    //         expiresIn: "30d"
    //     }
    // );

    // await refreshTokenService.createRefreshToken(
    //     user._id,
    //     refreshToken
    // );

    return {
        accessToken, 
        // refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: permissions[user.role] || []
        }
    };
}

module.exports={
    getallusers, createuser, updateuser, deleteuser, loginUser, getUser, getApiUsers
}