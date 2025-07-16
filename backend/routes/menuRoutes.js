const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const platController = require("../controllers/platController");
const menuItemController = require("../controllers/menuItemController");
const { validatePlatOnCreate, validatePlatOnUpdate } = require("../middlewares/validators");
const { validateMenu } = require("../middlewares/validators");

//-----route pour acceder au plats a partir du menu------
router.get("/:menuId/plats", platController.getPlatsByMenu);
router.post("/:menuId/plats", validatePlatOnCreate, platController.createPlatForMenu);
router.put("/:menuId/plats/:id",validatePlatOnUpdate, platController.updatePlatInMenu);
router.delete("/:menuId/plats/:platId", platController.deletePlatFromMenu);

//------route pour menu-----
router.post("/",validateMenu, menuController.createMenu);
router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.put("/:id",validateMenu, menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

// Routes MenuItem par menu
router.get("/:menuId/items", menuItemController.getMenuItems);
router.post("/:menuId/items", menuItemController.createMenuItem);
router.put("/:menuId/items/:itemId", menuItemController.updateMenuItem);
router.delete("/:menuId/items/:itemId", menuItemController.deleteMenuItem);

module.exports = router;