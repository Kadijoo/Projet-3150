const express = require("express");
const router = express.Router();
const controller = require("../controllers/menuItemController");
const { validateMenuItem } = require("../middlewares/validators");

router.post("/",validateMenuItem, controller.createMenuItem);
router.get("/", controller.getMenuItems);
router.put("/:id",validateMenuItem, controller.updateMenuItem);
router.delete("/:id", controller.deleteMenuItem);

module.exports = router;