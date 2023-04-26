function getAppropriateModel(collectionName, models) {
    if (models.hasOwnProperty(collectionName)) {
        return models[collectionName]
    } else {
        return null
    }
}


// return a list of all fields in the model that are a reference to item in another collection
async function getReferenceFieldsInModel(model) {
    const fields = model.schema.obj
    const fieldNames = Object.keys(fields)
    const refFieldNames = fieldNames.filter(
        fieldName => fields[fieldName].ref !== undefined
    )

    return refFieldNames.map(fieldName => {
        return {
            collectionName: fields[fieldName].ref,
            fieldName,
        }
    } )
}


module.exports = { getAppropriateModel, getReferenceFieldsInModel }