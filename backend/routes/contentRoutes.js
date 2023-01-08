const { Router } = require("express");
const router = new Router();
const { protect } = require("../middleware/authMiddleware");
const {
	getContentInCollection,
	addContentToCollection,
	deleteContentFromCollection,
	updateContentInCollection
} = require("../controllers/collectionContentController");

const { getDbCollections, addCollection } = require("../controllers/collectionTemplateController") 
// this router provides a general api to CRUD any collection. It expects the collection name and maybe some data 
// protect all route that involves user content..
router.use("/", protect)

// used to get all the collections in our db
router.get("/", getDbCollections) 

// used to add a new collection to the database
router.post("/", addCollection)


// routes to get and post content in a collection..
router.route("/:collectionname/").get(getContentInCollection).post(addContentToCollection)

//routes to update and delete a specific document in a collection..
router.route("/:collectionname/:id").put(updateContentInCollection).delete(deleteContentFromCollection)

// specifically protecting these routes from unauthorized access using the protect middleware
// router.use("/projects/:id", protect);




// handling projects
//router.route("/projects").get(getAllProjects).post(protect, addProject);
// router
//  .route("/projects/:id")
//  .get(getProject)
// .put(updateProject)
//  .delete(deleteProject);




module.exports = router;
