const { formatCollectionItem } = require("../helpers/CollectionUtils")
const { getAppropriateModel, getReferenceFieldsInModel } = require("../helpers/ContentCollectionUtils")
const Collection = require("../models/collectionModel")
const mongoose = require("mongoose")
//these controllers provide a general CRUD api used by the contentRoute to serve user content

/*
HOW THIS WORKS IN A NUTSHELL
 Each collection is assessed using a specific model. Models are created dynamically, then saved in an array as an express variable. 
 When a request comes in for any collection,the appropriate model for that collection is gotten from the models we have in memory 
 and that is used to perform the appropriate CRUD operation on that collection
*/

async function getContentInCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	if (appropriateModel === null) {
		return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
	}

	try {
		// const itemsInCollection = await recursivelyPopulate(appropriateModel)
		const itemsInCollection = await getItems(appropriateModel, models)
		res.json({ success: true, data: itemsInCollection })
	} catch (err) {
		console.log(err.message)
		// res.status(500).json({ success: false, message: "Couldn't complete request, try again" })
		res.status(500).json({ success: false, message: err.message })
	}
}



async function getItems(appropriateModel, models) {
	let items = await appropriateModel.find({})

	items = await recursivelyPopulateItems(items, appropriateModel, models)
	return items;

}

async function recursivelyPopulateItems(items, appropriateModel, models) {

	const pItems = []
	for (let item of items) {
		const pItem = await recursivelyPopulate(item, appropriateModel, models)
		pItems.push(pItem)
	}

	return pItems
}

async function recursivelyPopulate(item, appropriateModel, models) {
	// return a list of reference fields inside the model.
	const refFields = await getReferenceFieldsInModel(appropriateModel)

	// populate all reference fields in the current item using the list of ref Fields gotten from getReferenceFieldsInModel()
	const itemWithPopulatedRefFields = (await item.populate(...refFields.map(refField => refField.fieldName)))._doc

	// iterate through all refFields so we can iterate through each field of the object each refField contains in search of all reference fields which may exist within the newly populated object of that refField
	for (let refField of refFields) {
		// get the model for that collection
		const appropriateModel = getAppropriateModel(refField.collectionName, models)

		console.log("next obj: ", itemWithPopulatedRefFields[refField.fieldName])

		itemWithPopulatedRefFields[refField.fieldName] = await recursivelyPopulate(itemWithPopulatedRefFields[refField.fieldName], appropriateModel)
	}

	return itemWithPopulatedRefFields;

}

async function addContentToCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	if (appropriateModel === null) {
		return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
	}
	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ success: false, message: "No data was provided to create a new " + req.params.collectionname })
	}


	try {
		//get the name for each field in the schema of the appropriate model
		let fieldNames = Object.keys(appropriateModel.schema.paths)

		// check whether any of the essential fields are missing in the request body
		for (let field of fieldNames) {
			if ((req.body.hasOwnProperty(field) === false || req.body[field] === "" || req.body[field] == null) && field !== "_id" && field.options?.required === true) {
				return res.status(400).json({ success: false, message: `${field} was not provided or it's value was empty` })
			}
		}

		// get all referenced fields
		const refFields = await getReferenceFieldsInModel(appropriateModel)

		// Make sure that the value passed for any referenced field is valid. e.g if we have an 'book_author' field which
		//  references the 'author' collection, then we should make sure that the value passed to the 'book_author' field is an
		//  _id pointing to an actual author document in the 'author' collection and not just some arbitrary _id value 

		console.log(refFields)


		// proceed to add the new item in the collection, only if we're sure that all of it's reference properties have a value
		//  that points to valid values of that referenced collection
		for (let refField of refFields) {

			// get the name of the  collection that the  reference field points to
			const refCol = appropriateModel.schema.paths[refField].options.ref

			// using the name of the referenced collection, get the model for that collection
			const refColModel = getAppropriateModel(refCol, models)

			if (await isRefValueValid(refColModel, req.body[refField]) === false) {
				return res.status(400).json({ success: false, message: `the value provided for "${refField}" does not reference a valid item from "${refCol}" collection` })
			}
		}

		let item = await appropriateModel.create({ ...req.body })

		// populate all referenced fields with actual values
		for (let refField of refFields) {
			item = await item.populate(refField)
		}

		item = formatCollectionItem(item.toObject())

		res.status(201).json({ success: true, data: item })
	} catch (err) {
		let message;
		if (err.message.includes("E11000 duplicate key")) {
			message = "This record already exists in the database. Check your unique fields"
		} else {
			message = err.message
		}
		res.status(500).json({ success: false, message })
	}
}


// make sure there's an entry whose _id matches refValue inside the reference collection
async function isRefValueValid(model, refValue) {
	const valueExists = await model.exists({ _id: refValue })
	return valueExists === null ? false : true
}


async function deleteContentFromCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	const itemId = req.params.id

	if (appropriateModel === null) {
		return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
	}

	try {
		let item = await appropriateModel.findByIdAndDelete(itemId)
		item = formatCollectionItem(item.toObject())
		res.status(201).json({ success: true, data: item })
	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete request. Try again" })
	}
}


async function updateContentInCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	const itemId = req.params.id

	if (appropriateModel === null) {
		return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
	}

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ success: false, message: "No data was provided to update this " + req.params.collectionname })
	}

	try {
		let item = await appropriateModel.findByIdAndUpdate(itemId, { ...req.body }, { new: true })

		// get all referenced fields
		const refFields = await getReferenceFieldsInModel(appropriateModel)

		// populate all referenced fields with actual values
		for (let refField of refFields) {
			item = await item.populate(refField)
		}

		item = formatCollectionItem(item.toObject())
		res.status(201).json({ success: true, data: item })
	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete request. Try again" })
	}
}


module.exports = {
	getContentInCollection,
	addContentToCollection,
	deleteContentFromCollection,
	updateContentInCollection
}
