const { Router } = require("express");
const router = new Router();
const { protect } = require("../middleware/authMiddleware");
const {
	getContentInCollection,
	addContentToCollection,
	deleteContentFromCollection,
	updateContentInCollection
} = require("../controllers/collectionContentController");

const { getDbCollections, addCollection , deleteCollection} = require("../controllers/collectionTemplateController") 
// this router provides a general api to CRUD any collection. It expects the collection name and maybe some data 

// used to get all the collections in our db
// used to add a new collection to the database
router.route("/")
	.get(protect, getDbCollections)
	.post(protect, addCollection)

// route to delete a collection and all its items
router.route("/:id").delete(protect, deleteCollection)

// routes to get and post content in a collection..
router.route("/:collectionname/").get(getContentInCollection)
	.post(protect, addContentToCollection)

//protect /:collectionname/:id route
router.use("/:collectionname/:id", protect)

//routes to update and delete a specific document in a collection..
router.route("/:collectionname/:id").put(updateContentInCollection).delete(deleteContentFromCollection)

module.exports = router;
