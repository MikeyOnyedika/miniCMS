const { Schema, model } = require("mongoose");
const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
	
    timestamps: true,
  }
);

//This automatically creates a "admins" collection and this model allows us do database stuff to that collection
// Every resource we need to store in the mongodb database will have it's own model
module.exports = model("Admin", adminSchema);
