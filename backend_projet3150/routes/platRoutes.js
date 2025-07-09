const express = require("express");
const router = express.Router();
const controller = require("../controllers/ingredientController");
const platController = require("../controllers/platController");
const { validatePlatOnCreate, validatePlatOnUpdate } = require("../middlewares/validators");
//route pour ingredient----

router.post("/plats/:platId/ingredients", platController.addIngredientToPlat);
router.put("/plats/:platId/ingredients/:ingredientIndex", platController.updateIngredient);
router.delete("/plats/:platId/ingredients/:ingredientIndex", platController.removeIngredient);

// route pour plats ----
router.get("/", platController.getAll);
router.get("/:id", platController.getById);
//router.post("/",validatePlat, platController.create);
//router.put("/:id",validatePlat, platController.update);
router.post("/", validatePlatOnCreate, platController.create);
router.put("/:id", validatePlatOnUpdate, platController.update);
router.delete("/:id", platController.remove);

module.exports = router;

