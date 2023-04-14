const { Schema, model } = require("mongoose")

const collectionSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	primaryField: { type: String },
	fields: [],
	config: {}
}, {
	timestamps: true
})

module.exports = model("Collection", collectionSchema) 
