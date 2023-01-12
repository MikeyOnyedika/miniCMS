const { config } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const contentRoutes = require("./routes/contentRoutes");
const cors = require("cors");
const logger = require("./middleware/logger");
const { loadCollectionModels } = require("./helpers/CollectionUtils")
let models;
config();

async function startServer() {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // setup cors. Basically, allow browsers make request to this server
  app.use(cors());
  app.use(logger);

  if (await loadCollectionModels(app) === false){
    process.exit(1)
  }

  // handle crud operations on general user content
  app.use("/api/content/", contentRoutes);
  // says adminAuthRoutes should handle request for any route that begins with /api/admin/auth
  app.use("/api/admin/auth", adminAuthRoutes);
  // handler for unregistered routes
  app.use("*", (_, res) => {
    res.status(404).json({
      success: false,
      message: "Resource not found. You probably hit the wrong endpoint",
    });
  });

  const PORT = 5000;
  app.listen(PORT, () => console.log("Server listening on port: " + PORT));
}

async function main() {
  // make connection with the database first. If that works, start the express server, other wise, try to connect again
  mongoose.connect(process.env.MONGO_URI)

  mongoose.connection.on('open', error => {
    console.log("db connected")
    startServer();
  }).on('error', error => {
    console.log("Couldn't connect to mongodb. Try again...")
  })
}

main();
