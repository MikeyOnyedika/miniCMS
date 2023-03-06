const { default: mongoose } = require("mongoose")
const Collection = require("../models/collectionModel")

// takes a string value that specifies the type of data that goes in the field and returns the corresponding mongoose schema type
function parseToSchemaType(type) {
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

// converts the fields array to an object
function fieldsArrayToObj(fields){

	const fieldsObj = {}
	fields = [...fields]
	fields.forEach(field => {
		const fieldName = field.name
		delete field.name
		// use the defaultValue to set the value of default value for that particular field
		const defaultValue = field.defaultValue
		delete field.defaultValue
		fieldsObj[fieldName] = {...field, ['default']: defaultValue}  
	})
	return fieldsObj
}

// checks if the individual fields has the necessary values 
function parseFields(fields) {
	const parsedFields = []

	for (let field of fields) {
		const parsedFieldValue = {}

		// check that field is a valid object
		if (field instanceof Object === false) {
			return `One or more fields is not a valid object`
		}
	
		// check that field has a name property
		if (field.hasOwnProperty('name') === false || field.name === ""|| typeof field.name !== "string"){			return `One or more fields do not have a valid 'name' set`
		}
		parsedFieldValue.name = field.name

		// check field has a label property
		if (field.hasOwnProperty("label") === false || field.label === "" || typeof field.label !== "string"){
			return  `One or more fields do not have a valid value for 'label' `
		}
		parsedFieldValue.label = field.label

		// check that field has a 'type' property
		if (field.hasOwnProperty("type") === false || typeof field.type !== "string") {
			return `${field.label} field does not have a valid value for 'type' `
		}
		// map the string representing the type to an actual mongoose schema type
		parsedFieldValue.type = parseToSchemaType(field.type)

		if (field.hasOwnProperty("defaultValue") === false || field.defaultValue === ""){ 
			return `${field.label} field does not have a valid value for 'defaultValue' `
		}
		parsedFieldValue.defaultValue = field.defaultValue

		//  check for 'required' property
		if (field.hasOwnProperty("required") === false || typeof field.required !== "boolean"){
			return `${field.label} field does not have a valid value for 'required' `
		}
		parsedFieldValue.required = field.required


		// parse other properties which are specific to a type
		//

		parsedFields.push(parsedFieldValue)
	}

	return parsedFields
}


// gets all the templates for dynamic collections
async function getContentCollectionsTemplates() {
	return await Collection.find({})
}

// creates a model from a collection template provided
function createModelFromTemplate({ name, fields, config }) {
   fields = fieldsArrayToObj(fields)
	const modelSchema = new mongoose.Schema(fields, {
		timestamps: config.timestamps
	})

	return mongoose.model(name, modelSchema)
}

// gets the models for all the dynamic collections
async function getContentCollectionsModels() {
	let templates = await getContentCollectionsTemplates();

	if (typeof templates === "string") {
		throw new Error("One or more templates from db has been tampered therefore corrupt")
	}
	const models = {}
	for (let temp of templates) {
		temp.fields = parseFields(temp.fields)
		const model = createModelFromTemplate({ name: temp.name, fields: temp.fields, config: temp.config })
		models[temp.name] = model
	}

	return models
}


async function loadCollectionModels(app) {
	let success = false
	// create collection models from the templates and hold them in the models object which is then set as an express variable so it can be accessed from other places in our app
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

