const express = require("express");
const router = express.Router();
const platController = require("../controllers/platController");

router.get("/", platController.getAll);
router.get("/:id", platController.getById);
router.post("/", platController.create);
router.put("/:id", platController.update);
router.delete("/:id", platController.remove);

module.exports = router;
