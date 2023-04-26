const { parseFields, createModelFromTemplate, getContentCollectionsTemplates, loadCollectionModels, isPrimaryFieldValid } = require("../helpers/CollectionUtils")
const Collection = require("../models/collectionModel")
const { getAppropriateModel } = require("../helpers/ContentCollectionUtils")


async function getDbCollections(req, res) {
	try {
		let templates = await getContentCollectionsTemplates();
		templates = templates.map(template => {
			delete template.__v
			return template
		})
		res.status(200).json({ success: true, data: [...templates] })
	} catch (err) {
		res.status(404).json({ success: false, message: "Couldn't get collections from database" })
	}
}

async function addCollection(req, res) {
	try {
		// only permit frontend to be able to set some configs like timestamps. Which means not all sent config value will be passed to mongoose
		if (!req.body.name) {
			return res.status(400).json({ success: false, message: "Collection name is empty or isn't provided" })
		}

		if (!req.body.primaryField) {
			return res.status(400).json({ success: false, message: "Primary Field is empty or isn't provided" })
		}

		if (!req.body.fields || req.body.fields.length === 0) {
			return res.status(400).json({ success: false, message: "No field was provided, atlest 1 is needed" })
		}

		let { name, primaryField, fields, config } = req.body

		// convert name to lowercase because it is used as the name of the model and reference path whenever a document referencing is made. This is to avoid case sensitivity
		name = name.toLowerCase()

		// make sure the value of primaryField actually corresponds to the value of a name property of one of the fields
		if (isPrimaryFieldValid(primaryField, fields) === false) {
			return res.status(400).json({ success: false, message: "Primary Field does not match any field or it's matching a field whose content type is 'reference'" })
		}

		// get modelNames for the parseFields() from the app.get() expressjs variable
		const modelNames = Object.keys(req.app.get('models'))
		// make sure fields is an array with field objects that can be used to make a schema for a model 
		const pFields = parseFields(modelNames, fields)
		// fields is a string if it's an error message
		if (typeof pFields === "string") {
			return res.status(400).json({ success: false, message: pFields })
		}

		// save the template used to create the collection's model. Use the fields instead of pFields since pFields is parsed to use types that are actual mongoose schema types
		const collectionTemplate = await Collection.create({
			name,
			primaryField,
			fields,
			config: { timestamps: config.timestamps === undefined ? true : config.timestamps }
		})

		// reinflate models from collection template for all dynamic collection, that should also include the newly added template since loadCollectionModels() get's the collection templates it uses directly from the database
		if (await loadCollectionModels(req.app) === false) {
			process.exit(1)
		}

		const col = await Collection.findOne({ name })

		res.status(201).json({
			success: true,
			data: col
		})

	} catch (err) {
		let message = ""
		if (err.message.includes("E11000 duplicate key") && err.message.includes(`dup key: { name:`)) {
			message = "A collection with the name already exists"
		} else if (err.message.includes("Cannot overwrite")) {
			message = "A collection with the name already exists"
		} else {
			message = err.message
		}
		res.status(400).json({ success: false, message })
		//res.status(500).json({ success: false, message: "An error occured, couldn't complete request" })	
	}
}

async function deleteCollection(req, res) {
	try {
		const id = req.params.id
		console.log(id)
		let models = req.app.get("models")
		const collectionTemplateToDelete = await Collection.findById(id)
		if (collectionTemplateToDelete === null) {
			return res.status(200).json({ success: false, message: "No matching collection found. Collection may have already been deleted" })
		}

		// first delete the collection and all the documents stored in it using its model
		const appropriateModel = getAppropriateModel(collectionTemplateToDelete.name, models)

		if (appropriateModel === null) {
			return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
		}
		let result = await appropriateModel.collection.drop();

		//TODO: // loop through all dynamic collections and delete any field that  uses this collection as a reference type
		// result =  await deleteRefFieldsUsingCol(collectionTemplateToDelete.name)
		// if (result.success === false){
		// 	throw new Error(result.message)
		// }

		//  then delete the template for the model of that collection
		const deletedCollectionTemplate = await Collection.findByIdAndDelete(id)


		// TODO: MAKE THIS WORK.
		// loop through all dynamic collection and look for any refField that may have this collection as a ref collection, turn that field into a string input. Bascially, run an update on any collection template that uses that deleted collection.
		let colTemplates = await getContentCollectionsTemplates();

		for (let colTemplate of colTemplates) {
			// find out col templates that have fields using the deleted tmeplate as a ref
			colTemplate.fields.forEach((field) => {
				if (field.hasOwnProperty("of") && field.of === deletedCollectionTemplate.name) {
					// replace this field with a string field

				}
			})

		}






		// reload collection models so as to delete the model for the collection which the app still has in memory or die trying.
		if (await loadCollectionModels(req.app) === false) {
			process.exit(1)
		}
		res.status(200).json({ success: true, data: deletedCollectionTemplate })

	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete deleting the collection: " + err.message })
	}
}

async function updateCollection(req, res) {
	try {
		// only permit frontend to be able to set some configs like timestamps. Which means not all sent config value will be passed to mongoose
		if (!req.body.name) {
			return res.status(400).json({ success: false, message: "Collection name is empty or isn't provided" })
		}

		if (!req.body.primaryField) {
			return res.status(400).json({ success: false, message: "Primary Field is empty or isn't provided" })
		}

		if (!req.body.fields || req.body.fields.length === 0) {
			return res.status(400).json({ success: false, message: "No field was provided, atlest 1 is needed" })
		}

		let { name, primaryField, fields, config } = req.body

		// convert name to lowercase because it is used as the name of the model and reference path whenever a document referencing is made. This is to avoid case sensitivity
		name = name.toLowerCase()

		// make sure the value of primaryField actually corresponds to the value of a name property of one of the fields
		if (isPrimaryFieldValid(primaryField, fields) === false) {
			return res.status(400).json({ success: false, message: "Primary Field does not match any field or it's matching a field whose content type is 'reference'" })
		}

		// get modelNames for the parseFields() from the app.get() expressjs variable
		const modelNames = Object.keys(req.app.get('models'))
		// make sure fields is an array with field objects that can be used to make a schema for a model 
		const pFields = parseFields(modelNames, fields)
		// fields is a string if it's an error message
		if (typeof pFields === "string") {
			return res.status(400).json({ success: false, message: pFields })
		}

		// save the template used to create the collection's model. Use the fields instead of pFields since pFields is parsed to use types that are actual mongoose schema types
		const collectionTemplate = await Collection.create({
			name,
			primaryField,
			fields,
			config: { timestamps: config.timestamps === undefined ? true : config.timestamps }
		})

		// reinflate models from collection template for all dynamic collection, that should also include the newly added template since loadCollectionModels() get's the collection templates it uses directly from the database
		if (await loadCollectionModels(req.app) === false) {
			process.exit(1)
		}

		const col = await Collection.findOne({ name })

		res.status(201).json({
			success: true,
			data: col
		})

	} catch (err) {
		let message = ""
		if (err.message.includes("E11000 duplicate key") && err.message.includes(`dup key: { name:`)) {
			message = "A collection with the name already exists"
		} else if (err.message.includes("Cannot overwrite")) {
			message = "A collection with the name already exists"
		} else {
			message = err.message
		}
		res.status(400).json({ success: false, message })
		//res.status(500).json({ success: false, message: "An error occured, couldn't complete request" })	
	}
}


module.exports = {
	getDbCollections,
	addCollection,
	deleteCollection
}
