const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser } = require("../middlewares/validators");

router.post("/register-client",validateUser, userController.registerClient);
router.post("/register-restaurateur",validateUser, userController.registerRestaurateur);
router.post("/login",validateUser, userController.login);

module.exports = router;


