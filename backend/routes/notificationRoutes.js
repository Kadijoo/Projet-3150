const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const { validateNotification } = require("../middlewares/validators");


router.post("/",validateNotification, controller.createNotification);
router.get("/", controller.getNotifications);
router.put("/:id",validateNotification, controller.updateNotification);
router.delete("/:id", controller.deleteNotification);

module.exports = router;