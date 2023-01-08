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
		switch (fieldValue.type.toLowerCase()) {
			case "string":
				parsedFieldValue.type = mongoose.Schema.Types.String
				break;
			case "number":
				parsedFieldValue.type = mongoose.Schema.Types.Number
				break;
			case "mixed":
				parsedFieldValue.type = mongoose.Schema.Types.Mixed
			default:
				throw new Error("'type' does not match any mongoose schema type")
		}

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

module.exports = { parseFields, createModelFromTemplate, getContentCollectionsTemplates, getContentCollectionsModels }

