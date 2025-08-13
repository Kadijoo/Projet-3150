const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  validateRegisterClient,
  validateRegisterRestaurateur,
  validateLogin,
  verifyToken,
  upload // extrait uniquement `upload` du module validators.js
} = require("../middlewares/validators");
//const multer = require("multer");
//const upload = multer();

// Routes
/*console.log("userController keys :", Object.keys(userController));
console.log("typeof getUserProfile =", typeof userController.getUserProfile);*/
router.post("/register/client", upload.none(), validateRegisterClient, userController.registerClient);
//router.post("/register/restaurateur", validateRegisterRestaurateur, userController.registerRestaurateur);
router.post("/register/restaurateur", upload.none(), validateRegisterRestaurateur, userController.registerRestaurateur);
router.post("/login", validateLogin, userController.login);
//console.log("typeof verifyToken =", typeof verifyToken);
router.get("/profile", verifyToken, userController.getUserProfile);
//router.get("/restaurateurs", userController.getAllRestaurateurs);


// Upload photo de profil
//router.post("/profile/photo",verifyToken,upload.single("photo"), userController.uploadProfilePhoto);

module.exports = router;
