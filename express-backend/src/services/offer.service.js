const offerModel= require("../models/offer.model");

async function getall(){
    return await offerModel.find();
}

async function getone(id){
    return await offerModel.findById(id);
}

async function createone(data){
    return await offerModel.create(data);
}

async function update(id,data){
    return await offerModel.findByIdAndUpdate(id,data);
}

async function deleteoffer(id){
    return await offerModel.findByIdAndUpdate(id);
}

module.exports= {getall, getone, createone, update, deleteoffer};