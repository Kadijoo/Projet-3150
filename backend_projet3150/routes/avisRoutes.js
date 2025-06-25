const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");

router.post("/", avisController.create);
router.get("/", avisController.getAll);
router.get("/:id", avisController.getById);
router.get("/utilisateur/:userId", avisController.getByUser);
router.put("/:id", avisController.update);
router.delete("/:id", avisController.remove);

module.exports = router;
