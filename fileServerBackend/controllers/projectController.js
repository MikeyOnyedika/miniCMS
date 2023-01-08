const Image = require("../models/projectModel");
const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");

const domainName = "http://localhost:4444/";

// @desc Saves the link to a specific image to the db.
// @route /upload
// @method POST
// @access Private
async function saveImage(req, res) {
  try {
    const projectId = req.body.projectId;
    //see if this particular image's details is already saved in the database
    const matchFromDb = await Image.findOne({ projectId });
    // console.log(matchFromDb)
    const fileName = req.file.filename;
    if (matchFromDb) {
      // prevent saving the same image if it gets uploaded twice
      if (
        matchFromDb.fileName === fileName &&
        matchFromDb.size === req.file.size
      ) {
        // delete the uploaded image it's a duplicate
        const del = await fs.unlink(
          path.join(
            __dirname,
            "..",
            "uploads",
            "projectDisplayPictures",
            fileName
          )
        );
        // console.log(del)
        return res.json({
          success: true,
          url: domainName + "projectDisplayPictures/" + matchFromDb.fileName,
          projectId: matchFromDb.projectId,
        });
      }

      // update the matchFromDb with the uploaded image and delete the old image file for the matchFromDb
      await Image.findOneAndUpdate(
        { projectId },
        { fileName, originalName: req.file.originalname, size: req.file.size }
      );
      if (
        existsSync(
          path.join(
            __dirname,
            "..",
            "uploads",
            "projectDisplayPictures",
            matchFromDb.fileName
          )
        )
      ) {
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "uploads",
            "projectDisplayPictures",
            matchFromDb.fileName
          )
        );
      }

      return res.json({
        success: true,
        url: domainName + "projectDisplayPictures/" + fileName,
        projectId,
      });
    }

    // add a brand new image to db
    const image = await Image.create({
      fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      projectId: req.body.projectId,
    });
    res.json({
      success: true,
      url: domainName + "projectDisplayPictures/" + image.fileName,
      projectId: image.projectId,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: "couldn't add image" });
  }
}

// @desc Delete a specific image file and it's corresponding document entry in the database.
// @route /upload
// @method DELETE
// @access Private
async function deleteImage(req, res) {
  console.log("deleteImage called");

  const url = req.body.url;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: "No image url was provided" });
  }

  // terminate if url was not generated on this server
  const urlParts = url.split(domainName);
  console.log(urlParts);
  if (urlParts.length === 1) {
    return res.status(200).json({ success: true });
  }

  try {
    await Image.findOneAndDelete({ fileName: urlParts[1].split("/")[1] });
    await fs.unlink(path.join(__dirname, "..", "uploads", urlParts[1]));
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Couldn't complete delete. Try again" });
  }
}

module.exports = { saveImage, deleteImage };
