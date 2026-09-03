const ApiError = require("../../shared/errors/apiError");
const offerService= require("../services/offer.service");

async function getall(req,res){
    const offers= await offerService.getall();
    res.json(offers);
}

async function getone(req,res){
    const offer= await offerService.getone(req.params.id);

    if(!offer)
        throw new ApiError(404,"Invalid Offer ID");

    res.json(offer);
}

async function createone(req,res){
    const offer= await offerService.createone(req.body);
    res.json(offer);
}

async function updateone(req,res){
    const offer= await offerService.update(req.params.id,req.body);

    if(!offer)
        throw new ApiError(404,"Invalid offer ID");

    res.json(offer);
}

async function deleteoffer(req,res){
    const offer= await offerService.deleteoffer(req.params.id);
    
    if(!offer)
        throw new ApiError(404,"Offer not found");

    res.json(offer);
}

module.exports= {getall,getone,updateone,createone,deleteoffer}