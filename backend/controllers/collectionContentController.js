const { getAppropriateModel } = require("../helpers/ContentCollectionUtils")
//this controller provides a general CRUD api used by the contentRoute to serve user content

async function getContentInCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	if (appropriateModel === null) {
		return res.json({ success: false, message: "No collection with the specified name exists" })
	}
	try {
		const itemsInCollection = await appropriateModel.find({})
		res.json({ success: true, data: itemsInCollection })
	} catch (err) {
		res.status(500).json({ success: false, message: "Couldn't complete request, try again" })
	}
}

async function addContentToCollection(req, res) {
	const models = req.app.get("models")
	const appropriateModel = getAppropriateModel(req.params.collectionname, models)
	if (appropriateModel === null) {
		return res.json({ success: false, message: "No collection with the specified name exists" })
	}
	if (Object.keys(req.body).length === 0){
		return res.status(400).json({ success: false, message: "No data was provided to create a new " + req.params.collectionname })
	}

	try {
		const newItem = await appropriateModel.create({ ...req.body })
		res.status(201).json({ success: true, data: newItem })
	} catch (err) {
		let message;
		if (err.message.includes("E11000 duplicate key")){
			message = "This record already exists in the database. Check your unique fields"
		}else{
			message = err.message
		}
		res.status(500).json({ success: false, message })
	}
}

async function deleteContentFromCollection(req, res) {
	res.json({ success: true, data: {} })
}


async function updateContentInCollection(req, res) {
	res.json({ success: true, data: {} })
}


module.exports = {
	getContentInCollection,
	addContentToCollection,
	deleteContentFromCollection,
	updateContentInCollection
}
