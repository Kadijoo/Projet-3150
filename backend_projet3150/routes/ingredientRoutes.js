const express = require("express");
const router = express.Router();
const controller = require("../controllers/ingredientController");

router.post("/", controller.createIngredient);
router.get("/", controller.getIngredients);
router.put("/:id", controller.updateIngredient);
router.delete("/:id", controller.deleteIngredient);

module.exports = router;
