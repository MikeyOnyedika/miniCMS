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
		case "boolean":
			return mongoose.Schema.Types.Boolean
		case "reference":
			return mongoose.Schema.Types.ObjectId
		default:
			throw new Error("'type' does not match any mongoose schema type")
	}
}

// converts the fields array to an object
function fieldsArrayToObj(fields) {
	// TODO: generate the _id for each field object here using `new ObjectId()` or maybe somehwere before here, so that the version of the template that would be saved to the database will also have the generated _id property on it
	const fieldsObj = {}
	fields = [...fields]
	fields.forEach(field => {
		const fieldName = field.name
		delete field.name
		// use the defaultValue to set the value of `default` for that particular field
		const defaultValue = field.defaultValue
		delete field.defaultValue
		fieldsObj[fieldName] = { ...field, ['default']: defaultValue }
	})
	return fieldsObj
}

// convert fields to a format that can be used by mongoose to represent the fields of the collection
// acts as a parser for the different content types and their expected properties
function parseFields(modelNames, fields) {
	const parsedFields = []

	for (let field of fields) {
		const parsedFieldValue = {}

		// check that field is a valid object
		if (field instanceof Object === false) {
			return `One or more fields is not a valid object`
		}

		// check that field has a name property
		if (field.hasOwnProperty('name') === false || field.name === "" || typeof field.name !== "string") {
			return `One or more fields do not have a valid 'name' set`
		}
		parsedFieldValue.name = field.name

		// check field has a label property
		if (field.hasOwnProperty("label") === false || field.label === "" || typeof field.label !== "string") {
			return `One or more fields do not have a valid value for 'label' `
		}
		parsedFieldValue.label = field.label

		// check that field has a 'type' property
		if (field.hasOwnProperty("type") === false || typeof field.type !== "string") {
			return `${field.label} field does not have a valid value for 'type' `
		}

		// map the string representing the type to an actual mongoose schema type
		parsedFieldValue.type = parseToSchemaType(field.type)


		//  check for 'required' property
		if (field.hasOwnProperty("required") === false || typeof field.required !== "boolean") {
			return `${field.label} field does not have a valid value for 'required' `
		}
		parsedFieldValue.required = field.required


		// parse other properties which are specific to a content type

		// check for defaultValue property on 'string', 'number', 'boolean', 'date' types
		// defaultValue is optional
		if (field.type === "string" || field.type === "number" || field.type === "boolean" || field.type === "date") {
			if (field.hasOwnProperty("defaultValue") === true && field.defaultValue !== "") {
				parsedFieldValue.defaultValue = field.defaultValue
			}
		}

		// check for placeholder property on 'string' or 'number' type
		if (field.type === "string" || field.type === "number") {
			if (!hasValidPlaceholder(field)) {
				return `${field.label} field does not have a valid value for 'placeholder' `
			}
			parsedFieldValue.placeholder = field.placeholder
		}

		// check for the 'of' property on 'reference' type
		if (field.type === "reference") {
			if (!hasValidOf(field)) {
				return `${field.label} field does not have a valid value for 'of' `
			} else {
				field.of = field.of.toLowerCase()
				// TODO:  add a check so that if the ref collection name (i.e the ref model) to be used is the same as the name of the collection, then it passes. This will allow say using `user` as a reference collection to a field inside the `user` model
				if (!isRefModelExists(modelNames, field.of)) {
					return `reference type used in ${field.label} field does not exist yet. It should be created first`
				}
				parsedFieldValue.ref = field.of
			}
		}

		parsedFields.push(parsedFieldValue)
	}

	return parsedFields
}

function hasValidOf(field) {
	if (field.hasOwnProperty("of") === false || field.of === "") {
		return false
	} else {
		return true
	}
}

// check to make sure a model exists for the collection name to be used as reference type. This prevents crashing the server when it tries to run createModelFromTemplate() 
function isRefModelExists(modelNames, ref) {
	for (let name of modelNames) {
		if (name.toLowerCase() === ref) {
			return true
		}
	}
	return false
}

function hasValidPlaceholder(field) {
	if (field.hasOwnProperty("placeholder") === false || field.placeholder === "") {
		return false
	} else {
		return true
	}
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

	// convert name to lowercase so both this name and the name passed as reference if this collection is referenced from a different collection, will match exactly
	name = name.toLowerCase()
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
		const modelNames = templates.map(temp => temp.name)

		const pFields = parseFields(modelNames, temp.fields)
		if (typeof pFields === "string") {
			console.log("pFields: ", pFields)
			throw new Error(pFields)
		}
		temp.fields = pFields;
		const model = createModelFromTemplate({ name: temp.name, fields: temp.fields, config: temp.config })
		// convert the model name to lowercase to avoid case issues later
		models[temp.name.toLowerCase()] = model
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
		const models = await getContentCollectionsModels(app)
		app.set("models", models)
		success = true
	} catch (err) {
		console.log("Couldn't create models from templates: ", err.message)
	}

	return success
}

// not used yet
function toKebabCase(spacedText) {
	return spacedText.toLowerCase().replace(/[ ]+/g, "-")
}

function formatCollectionItem(item) {
	const modifiedItem = { ...item }
	delete modifiedItem.__v

	return modifiedItem
}


function isPrimaryFieldValid(primaryField, fields) {
	for (let field of fields) {
		if (primaryField === field.name && field.type !== "reference") {
			// yep! definitely valid, since it (primaryField) matches the value of this field.name and this field isn't a reference field
			return true
		}
	}

	return false
}


// delete all fields in any collection template that uses the specified collection as reference type. This is done because the collection used as reference type is about to be deleted
async function deleteRefFieldsUsingCol(delColName) {
	// loop through all collection templates
	let colTemplates = await getContentCollectionsTemplates()
	colTemplates = colTemplates.map((col) => {
		const colFieldNames = Object.keys(col)

	})
}
module.exports = { formatCollectionItem, parseFields, createModelFromTemplate, getContentCollectionsTemplates, getContentCollectionsModels, loadCollectionModels, isPrimaryFieldValid, deleteRefFieldsUsingCol }