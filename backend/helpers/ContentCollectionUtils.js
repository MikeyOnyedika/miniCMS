function getAppropriateModel(collectionName, models){
    if (models.hasOwnProperty(collectionName)){
        return models[collectionName]
    }else{
        return null
    }
}



module.exports = { getAppropriateModel }