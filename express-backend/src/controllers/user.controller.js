const logger = require("../logger");
const userService= require("../services/user.service");
const refreshTokenService = require("../services/refreshToken.service");
const jwt= require("jsonwebtoken");
const ApiError = require("../../shared/errors/apiError");

async function getAllUser(req,res){
    const users= await userService.getallusers(req.query);
    res.json(users);
}

async function getuser(req,res){
    const userID= req.user.id;

    const user= await userService.getUser(userID);
    res.status(201).json({
        status: "Success",
        data: user
    });
}

async function createuser(req,res){
    const user=await userService.createuser(req.body);

    res.status(201).json({
        status: "Success",
        data: user
    });
}

async function updateuser(req,res){
    const userID= req.user.id;
    const user= await userService.updateuser(userID,req.body);

    if(!user){
        throw new ApiError(404,"User not found!");
    }

    res.json({
        status: "Success",
        data: user
    });
}

async function deleteuser(req,res){
    const user= await userService.deleteuser(req.params.id);
    
    if(!user)
        throw new ApiError(404,"User not found!");

    res.status(204).end();
}

async function loginUser(req,res){
    const { accessToken, refreshToken } = await userService.loginUser(req.body);

    res.status(200).json({
        status: true,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

async function home(req,res){
    const authHeader= req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.send(decoded);
}

module.exports ={
    getAllUser,createuser,updateuser, deleteuser, loginUser, home, getuser
}