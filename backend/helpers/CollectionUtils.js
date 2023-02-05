const { default: mongoose } = require("mongoose")
const Collection = require("../models/collectionModel")

function containsOnlyObjects(fields) {
	// make sure the value for each property in the fields object is an object
	const fieldProps = Object.keys(fields)
	for (let prop of fieldProps) {
		const propValue = fields[prop]
		if (propValue instanceof Object === false) {
			return false
		}
	}
	return true
}

// takes a string value that specifies the type of data that goes in the field and returns the corresponding mongoose schema type
function parseFieldType(type) {
	type = type.toLowerCase();
	switch (type) {
		case "string":
			return mongoose.Schema.Types.String
		case "number":
			return mongoose.Schema.Types.Number
		case "date":
			return mongoose.Schema.Types.Date
		case "buffer":
			return mongoose.Schema.Types.Buffer
		case "boolean":
			return mongoose.Schema.Types.Boolean
		case "objectid":
			return mongoose.Schema.Types.ObjectId
		case "array":
		case "[]":
			return mongoose.Schema.Types.Array
		case "decimal128":
			return mongoose.Schema.Types.Decimal128
		case "mixed":
			return mongoose.Schema.Types.Mixed
		default:
			throw new Error("'type' does not match any mongoose schema type")
	}
}

// checks if the individual field has the necessary values 
function parseFields(fields) {
	const parsedFieldsObj = {}
	if (containsOnlyObjects(fields) === false) {
		return "One or more provided fields are not valid objects"
	}
	const fieldsProps = Object.keys(fields)

	for (let field of fieldsProps) {
		// get the object value of that prop
		const fieldValue = fields[field]
		const parsedFieldValue = {}

		// check that field has a 'type' property
		if (fieldValue.hasOwnProperty("type") === false) {
			return "A field does not have a 'type' property, but this is required"
		}

		// map the string representing the type to an actual mongoose schema type
		parsedFieldValue.type = parseFieldType(fieldValue.type)

		//  check for 'required' property
		if (fieldValue.hasOwnProperty("required") === true) {
			if (fieldValue.required === true || fieldValue.required === false) {
				parsedFieldValue.required = fieldValue.required
			} else {
				return "A field has a 'required' property whose value is not a valid boolean value"
			}
		}

		// check for 'unique' property
		if (fieldValue.hasOwnProperty("unique") === true) {
			if (fieldValue.unique === true || fieldValue.unique === false) {
				parsedFieldValue.unique = fieldValue.unique
			} else {
				return "A field has a 'unique' property whose value is not a valid boolean value"
			}
		}

		parsedFieldsObj[field] = {
			...parsedFieldValue
		}

	}

	return parsedFieldsObj
}


// gets all the templates for dynamic collections
async function getContentCollectionsTemplates() {
	return await Collection.find({})
}

// creates a model from a collection template provided
function createModelFromTemplate({ collectionName, fields, config }) {
	const modelSchema = new mongoose.Schema(fields, {
		timestamps: config.includeTimeStamps || true
	})

	return mongoose.model(collectionName, modelSchema)
}

// gets the models for all the dynamic collections
async function getContentCollectionsModels() {
	let templates = await getContentCollectionsTemplates();

	if (typeof templates === "string") {
		throw new Error("One or more templates from db is corrupt")
	}
	const models = {}

	for (let temp of templates) {
		temp.fields = parseFields(temp.fields)
		const model = createModelFromTemplate({ collectionName: temp.name, fields: temp.fields, config: temp.config })
		models[temp.name] = model
	}

	return models
}


async function loadCollectionModels(app) {
	let success = false
	// create database models from the collection templates and hold them in the models object which is then set as an express variable so it can be accessed from other places in our app
	try {
		//try garbage collecting the models before re-creating them afresh to update the dynamic collections
		const allAppModels = Object.keys(mongoose.models)
		for (let modelName of allAppModels) {
			if (modelName !== "Admin" && modelName !== "Collection") {
				delete mongoose.models[modelName]
			}
		}

		const models = await getContentCollectionsModels()
		app.set("models", models)
		success = true
	} catch (err) {
		console.log("Couldn't create models from templates: ", err.message)
	}

	return success
}

function toKebabCase(spacedText) {
	return spacedText.toLowerCase().replace(/[ ]+/g, "-")
}

function formatCollectionItem(item) {
	const modifiedItem = { ...item }
	const createdAt = modifiedItem.createdAt;
	const lastUpdateAt = modifiedItem.updatedAt;
	delete modifiedItem.__v
	delete modifiedItem.createdAt
	delete modifiedItem.updatedAt

	modifiedItem['created-at'] = createdAt
	modifiedItem['last-update-at'] = lastUpdateAt
	
	return modifiedItem 
}

module.exports = { formatCollectionItem, parseFields, createModelFromTemplate, getContentCollectionsTemplates, getContentCollectionsModels, loadCollectionModels }

