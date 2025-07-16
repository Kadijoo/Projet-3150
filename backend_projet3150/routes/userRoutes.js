/*const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register/client", userController.registerClient);
router.post("/register/restaurateur", userController.registerRestaurateur);
router.post("/login", userController.login);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  validateRegisterClient,
  validateRegisterRestaurateur,
  validateLogin
} = require("../middlewares/validators");

router.post("/register/client", validateRegisterClient, userController.registerClient);
router.post("/register/restaurateur", validateRegisterRestaurateur, userController.registerRestaurateur);
router.post("/login", validateLogin, userController.login);

module.exports = router;






