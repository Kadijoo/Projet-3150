const express = require("express");
const router = express.Router();
const controller = require("../controllers/sectionController");

router.post("/", controller.createSection);
router.get("/", controller.getSections);
router.put("/:id", controller.updateSection);
router.delete("/:id", controller.deleteSection);

module.exports = router;
