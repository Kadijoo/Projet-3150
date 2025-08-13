const express = require("express");
const router = express.Router();
const controller = require("../controllers/ingredientController");
const platController = require("../controllers/platController");
const { upload, validatePlatOnCreate, validatePlatOnUpdate } = require("../middlewares/validators");
//route pour ingredient----

router.post("/plats/:platId/ingredients", platController.addIngredientToPlat);
router.put("/plats/:platId/ingredients/:ingredientIndex", platController.updateIngredient);
router.delete("/plats/:platId/ingredients/:ingredientIndex", platController.removeIngredient);

// route pour plats ----
//router.get("/", platController.getAllPlats);
//router.get("/public", platController.getAllPlats);
router.get("/", platController.getAllPlats);
//router.get("/", platController.getPlats);
router.get("/:id", platController.getById);
//router.post("/",validatePlat, platController.create);
//router.put("/:id",validatePlat, platController.update);
//router.post("/", validatePlatOnCreate, platController.create);
router.post("/", upload.single("image"), validatePlatOnCreate, platController.create);
router.put("/:id", validatePlatOnUpdate, platController.update);
router.put("/plats/:platId/associer-menu/:menuId", platController.associerPlatAuMenu);
router.delete("/:id", platController.remove);
//router.get('/restaurateur/:id', getPlatsByRestaurateur);
router.get("/by-restaurateur/:id", platController.getPlatsByRestaurateur);
router.get("/avec-resto/:id", platController.getPlatsAvecNomRestaurant);

module.exports = router;

