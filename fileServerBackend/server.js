const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { saveImage, deleteImage } = require("./controllers/projectController");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const { protect } = require("./middleware/authMiddleware");

config();

function startServer() {
  const app = express();

  // tell express the folder that contains all static files incase a client makes a requst for any of them.
  app.use(express.static(path.join(__dirname, "uploads")));

  // setup some middleware

  app.use(cors()); // allows express accept requests coming from browser clients
  app.use(express.urlencoded({ extended: false })); // allows express be able to understand data sent in the body  of a request
  app.use(express.json()); // allows express understand json data sent in the body of a request

  //setting up what will give us a middleware to handle files when they are uploaded to this server
  const projectFileStorage = multer.diskStorage({
    destination: (req, file, cb) =>
      cb(null, __dirname + "/uploads/projectDisplayPictures"),
    filename: (req, file, cb) => {
      cb(null, uuid() + "." + file.mimetype.split("/")[1]);
    },
  });

  const upload = multer({ storage: projectFileStorage });

  //setting different controller functions for different routes.
  app.post("/upload", protect, upload.single("image"), saveImage); // upload.single() returns a middleware that will first run, making data to the uploaded file available to us througth req.file
  app.delete("/upload", protect, deleteImage);

  const PORT = 4444;
  app.listen(PORT, () => console.log("File Server Listening On Port " + PORT));
}

//only start server if mongodb is connected.
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (!err) {
    console.log("Mongodb connected");
    startServer();
  } else {
    console.log("Couldn't connect to mongodb. Server startup terminated");
  }
});
