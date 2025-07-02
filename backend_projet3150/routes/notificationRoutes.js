const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router.post("/", controller.createNotification);
router.get("/", controller.getNotifications);
router.put("/:id", controller.updateNotification);
router.delete("/:id", controller.deleteNotification);

module.exports = router;