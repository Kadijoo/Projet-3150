const express = require("express");
const router = express.Router();
const controller = require("../controllers/voteController");

router.post("/", controller.createVote);
router.get("/", controller.getVotes);
router.put("/:id", controller.updateVote);
router.delete("/:id", controller.deleteVote);

module.exports = router;