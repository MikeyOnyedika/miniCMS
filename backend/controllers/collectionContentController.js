const { getAppropriateModel } = require("../helpers/ContentCollectionUtils")
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
		let itemsInCollection = await appropriateModel.find({}).lean()
		// rename _id to id, createdAt to created-at, updatedAt to last-update-at. Delete _v
		itemsInCollection = itemsInCollection.map(item => {
			item = { ...item }
			const createdAt = item.createdAt;
			const lastUpdateAt = item.updatedAt;
			delete item.__v
			delete item.createdAt
			delete item.updatedAt

			item['created-at'] = createdAt
			item['last-update-at'] = lastUpdateAt

			return item
		})

		console.log(itemsInCollection)
		res.json({ success: true, data: itemsInCollection })
	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete request, try again" })
	}
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
		// filter out some unnecessary fields we don't ever expect user to provide
		fieldNames = fieldNames.filter(field => {
			if (field === "createdAt" || field === "__v" || field === "updatedAt") {
				return false
			} else {
				return true
			}
		})

		console.log("model.schema.paths: ", appropriateModel.schema.paths)

		// check whether any of the essential fields are missing in the request body
		for (let field of fieldNames) {
			if ((req.body.hasOwnProperty(field) === false || req.body[field] === "" || req.body[field] == null) && field !== "_id" && field.options?.required === true) {
				return res.status(400).json({ success: false, message: `${field} was not provided or it's value was empty` })
			}
		}

		const newItem = await appropriateModel.create({ ...req.body })
		res.status(201).json({ success: true, data: newItem })
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

async function deleteContentFromCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	const itemId = req.params.id

	if (appropriateModel === null) {
		return res.status(400).json({ success: false, message: "No collection with the specified name exists" })
	}

	try {
		const deletedItem = await appropriateModel.findByIdAndDelete(itemId)
		res.status(201).json({ success: true, data: deletedItem })
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
		const modifiedItem = await appropriateModel.findByIdAndUpdate(itemId, { ...req.body }, { new: true })
		res.status(201).json({ success: true, data: modifiedItem })
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
