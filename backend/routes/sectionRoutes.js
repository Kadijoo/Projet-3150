


const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const { validateSection } = require("../middlewares/validators");

router.post("/", validateSection, sectionController.createSection);
router.get("/", sectionController.getAllSections);
router.get("/:id", sectionController.getSectionById);
router.put("/:id", validateSection, sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;