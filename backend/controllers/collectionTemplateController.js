const { parseFields, createModelFromTemplate, getContentCollectionsTemplates, loadCollectionModels } = require("../helpers/CollectionUtils")
const Collection = require("../models/collectionModel")
const { getAppropriateModel } = require("../helpers/ContentCollectionUtils")


async function getDbCollections(req, res) {
	try {
		const templates = await getContentCollectionsTemplates();
		const collectionsByName = templates.map(col => ({ collectionName: col.name, collectionId: col._id }))
		res.status(200).json({ success: true, data: { collections: [...collectionsByName] } })
	} catch (err) {
		res.status(404).json({ success: false, message: "Couldn't get collections" })
	}
}

async function addCollection(req, res) {
	try {
		// only permit frontend to be able to set some configs like timestamps. Which means not all sent config value will be passed to mongoose
		if (!req.body.collectionName || !req.body.fields || Object.keys(req.body.fields).length === 0) {
			return res.status(400).json({ success: false, message: "Collection name or fields are missing" })
		}

		let { collectionName, fields, config } = req.body
		// make sure fields is an object with field objects that can be used to make a schema for a model 
		const pFields = parseFields(fields)
		// fields is a string if it's an error message
		if (typeof pFields === "string") {
			return res.status(400).json({ success: false, message: pFields })
		}

		// create an actual mongoose model from template
		const newModel = createModelFromTemplate({ collectionName, pFields, config })

		// add the model to the list of mongoose models available, so that it can be used to crud data from it's collection,
		// when a client makes a request
		req.app.get("models")[collectionName] = newModel

		// save the template used to create the collection's model. Use the fields instead of pFields since pFields is parsed to use types that are actual mongoose schema types
		console.log("templates before saving: ", fields)
		const modelTemplate = await Collection.create({
			name: collectionName,
			fields,
			config: { timestamps: config.includeTimeStamps || true }
		})

		res.json({
			success: true, data: {
				collection: {
					name: modelTemplate.name,
					fields: modelTemplate.fields,
					config: modelTemplate.config
				}
			}
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
		res.status(500).json({ success: false, message })
		//res.status(500).json({ success: false, message: "An error occured, couldn't complete request" })	
	}
}

async function deleteCollection(req, res) {
	try {
		const id = req.params.id
		let models = req.app.get("models")
		const collectionTemplateToDelete = await Collection.findById(id)
		console.log(collectionTemplateToDelete.name)

		// first delete the collection and all the documents stored in it using its model
		const appropriateModel = getAppropriateModel(collectionTemplateToDelete.name, models)
		if (appropriateModel === null) {
			return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
		}
		const result = await appropriateModel.collection.drop();
		//  then delete the template for 
		const deletedCollectionTemplate = await Collection.findByIdAndDelete(id)
		// reload collection models so as to delete the model for the collection which the app still has in memory or die trying.
		if (await loadCollectionModels(req.app) === false) {
			process.exit(1)
		}
		res.status(200).json({ success: true, data: deletedCollectionTemplate })

	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete request" })
	}
}

module.exports = {
	getDbCollections,
	addCollection,
	deleteCollection
}
