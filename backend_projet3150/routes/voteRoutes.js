const express = require("express");
const router = express.Router();
const controller = require("../controllers/voteController");
const { validateVote } = require("../middlewares/validators");

router.post("/",validateVote, controller.createVote);
router.get("/", controller.getVotes);
router.put("/:id",validateVote, controller.updateVote);
router.delete("/:id", controller.deleteVote);

module.exports = router;