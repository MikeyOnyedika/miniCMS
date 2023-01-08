const { Schema, model } = require("mongoose");

// a repetition of the data model from the first backend. Used to access admin info from the admins Collection
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

module.exports = model("Admin", adminSchema);
