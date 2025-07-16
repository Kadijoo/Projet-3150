const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");
const { validateAvis } = require("../middlewares/validators");

router.post("/",validateAvis, avisController.create);
router.get("/", avisController.getAll);
router.get("/:id", avisController.getById);
router.get("/utilisateur/:userId", avisController.getByUser);
router.put("/:id",validateAvis, avisController.update);
router.delete("/:id", avisController.remove);

module.exports = router;
