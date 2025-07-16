const express = require("express");
const router = express.Router();
const propositionController = require("../controllers/propositionController");
const { validateProposition } = require("../middlewares/validators");

router.post("/", validateProposition, propositionController.createProposition);
router.get("/", propositionController.getAllPropositions);
router.get("/:id", propositionController.getPropositionById);
router.put("/:id", validateProposition, propositionController.updateProposition);
router.delete("/:id", propositionController.deleteProposition);

module.exports = router;
