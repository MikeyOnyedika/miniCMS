function getAppropriateModel(collectionName, models) {
    if (models.hasOwnProperty(collectionName)) {
        return models[collectionName]
    } else {
        return null
    }
}


// return all field of a collection that has a ref so that they can be populated
function getReferenceFieldsInModel(model) {
    // console.log(model.schema.obj)
    const fields = model.schema.obj
    const fieldNames = Object.keys(fields)
    return fieldNames.filter(
        fieldName => fields[fieldName].ref !== undefined
    )
}


module.exports = { getAppropriateModel, getReferenceFieldsInModel }