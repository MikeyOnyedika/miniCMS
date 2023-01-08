const { Schema, model } = require("mongoose");

// a model for the image data stored in mongodb
const imageSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    size: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Image", imageSchema);
