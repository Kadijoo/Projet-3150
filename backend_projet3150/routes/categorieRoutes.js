const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorieController");

router.post("/", controller.createCategorie);
router.get("/", controller.getCategories);
router.put("/:id", controller.updateCategorie);
router.delete("/:id", controller.deleteCategorie);

module.exports = router;