const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User CRUD routes
router.post("/create-user", userController.createUser);
router.get("/all-users", userController.getAllUsers);
router.get("/single-user/:id", userController.getUserById);
router.put("/update-user/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Login route
router.post("/login", userController.loginUser);

module.exports = router;
