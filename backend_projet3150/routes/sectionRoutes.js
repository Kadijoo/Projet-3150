const express = require("express");
const router = express.Router();
const controller = require("../controllers/sectionController");
const { validateSection } = require("../middlewares/validators");


router.post("/",validateSection, controller.createSection);
router.get("/", controller.getSections);
router.put("/:id",validateSection, controller.updateSection);
router.delete("/:id", controller.deleteSection);

module.exports = router;
