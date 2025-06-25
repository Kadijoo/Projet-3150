const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register-client", userController.registerClient);
router.post("/register-restaurateur", userController.registerRestaurateur);
router.post("/login", userController.login);

module.exports = router;


