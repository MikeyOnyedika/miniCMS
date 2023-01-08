const { Router } = require("express");
const {
  loginAdmin,
  registerAdmin,
  getMe,
  signNewToken
} = require("../controllers/adminAuthController");
const router = new Router();
const { protect, tokenExpire } = require("../middleware/authMiddleware");

// setting a controller function to run when a route is hit

router.post("/login", loginAdmin);
// router.post("/register", registerAdmin);

// protect function is used to protect the getMe controller function so that only those with a valid token can access it.
router.get("/@me", protect, getMe);
router.get("/checkToken", protect, tokenExpire)
router.get("/signNewToken", protect, signNewToken)
 

module.exports = router;
