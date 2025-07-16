const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorieController");
const { validateCategorie } = require("../middlewares/validators");


router.post("/",validateCategorie, controller.createCategorie);
router.get("/", controller.getCategories);
router.put("/:id",validateCategorie, controller.updateCategorie);
router.delete("/:id", controller.deleteCategorie);

module.exports = router;