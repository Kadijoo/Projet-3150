const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const { validateVote } = require("../middlewares/validators");

router.post("/", validateVote, voteController.createVote);
router.get("/", voteController.getAllVotes);
router.get("/:id", voteController.getVoteById);
router.delete("/:id", voteController.deleteVote);

module.exports = router;
