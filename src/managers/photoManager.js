const Photo = require('../models/Photo');
const User = require('../models/User');

exports.create = (ownerId, photoData) => Photo.create({...photoData,owner: ownerId});

exports.getAll = () => Photo.find({}).lean();

exports.getOne = (photoId) => Photo.findById(photoId);

exports.updateComments = (photoId, photoData) => Photo.findByIdAndUpdate(photoId, photoData, {runValidators: true});

exports.delete = (photoId) => Photo.findByIdAndDelete(photoId);

exports.update = (photoId, photoData) => Photo.findByIdAndUpdate(photoId, photoData, {runValidators: true});

exports.getUser = (userId) => User.findById(userId).lean();

exports.search = async(userId) => {
    let photoes = await this.getAll();

    
       photoes = photoes.filter(x => x.owner == userId);
    

    return photoes;
}