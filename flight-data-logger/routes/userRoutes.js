const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth"); // Ensure this file exists
const roleMiddleware = require("../middleware/roleMiddleware"); // Ensure this file exists

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/", auth, roleMiddleware(["admin"]), userController.getAllUsers);

module.exports = router;
