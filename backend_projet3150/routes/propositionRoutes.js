const express = require("express");
const router = express.Router();
const controller = require("../controllers/propositionController");
const { validateProposition } = require("../middlewares/validators");

router.post("/",validateProposition, controller.createProposition);
router.get("/", controller.getPropositions);
router.put("/:id",validateProposition, controller.updateProposition);
router.delete("/:id", controller.deleteProposition);

module.exports = router;