const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const restaurantController = require("../controllers/restaurantController");
const { upload, validateRestaurant } = require("../middlewares/validators");


//----- route permettant d'acceder aux menus d'un restaurant--

router.get("/restaurants/:restaurantId/menus", menuController.getMenusByRestaurant);
router.post("/restaurants/:restaurantId/menus", menuController.createMenuForRestaurant);
router.put("/restaurants/:restaurantId/menus/:menuId", menuController.updateMenuOfRestaurant);
router.delete("/restaurants/:restaurantId/menus/:menuId", menuController.deleteMenuOfRestaurant);
//router.post("/restaurants", upload.single("image"), validateRestaurant, restaurantController.create);

//------route pour restaurant-------
router.post("/", upload.single("image"), validateRestaurant, restaurantController.create);
//router.get("/", restaurantController.getRestaurants);
router.get("/", restaurantController.getAll);
router.get("/:id", restaurantController.getById);
router.put("/:id",validateRestaurant, restaurantController.update);
router.delete("/:id", restaurantController.remove);
//router.get("/", restaurantController.getAllRestaurants);
//router.get("/", restaurantController.getRestaurants);

module.exports = router;

