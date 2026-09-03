const RefreshToken= require("../models/refreshToken.model");

async function createRefreshToken(userId, token){
    const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );
    
    return await RefreshToken.create({
        user: userId,
        token,
        expiresAt
    });
}

async function findRefreshToken(token){
    return await RefreshToken.findOne({ token });
}

async function deleteRefreshToken(token){
    return await RefreshToken.deleteOne({token});
}

async function deleteAllUserTokens(userId){
    return await RefreshToken.deleteMany({
        user: userId
    });
}

module.exports= {
    createRefreshToken, findRefreshToken, deleteRefreshToken, deleteAllUserTokens
}