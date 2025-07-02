const express = require("express");
const router = express.Router();
const controller = require("../controllers/propositionController");

router.post("/", controller.createProposition);
router.get("/", controller.getPropositions);
router.put("/:id", controller.updateProposition);
router.delete("/:id", controller.deleteProposition);

module.exports = router;