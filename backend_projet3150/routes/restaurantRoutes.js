const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.post("/", restaurantController.create);
router.get("/", restaurantController.getAll);
router.get("/:id", restaurantController.getById);
router.put("/:id", restaurantController.update);
router.delete("/:id", restaurantController.remove);

module.exports = router;

