const express = require("express");
const router = express.Router();
const controller = require("../controllers/ingredientController");
const { validateIngredient } = require("../middlewares/validators");

router.post("/",validateIngredient, controller.createIngredient);
router.get("/", controller.getIngredients);
router.put("/:id",validateIngredient, controller.updateIngredient);
router.delete("/:id", controller.deleteIngredient);

module.exports = router;
