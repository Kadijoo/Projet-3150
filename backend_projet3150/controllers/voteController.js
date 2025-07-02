const Vote = require("../models/Vote");

exports.createVote = async (req, res) => {
  try {
    const vote = new Vote(req.body);
    await vote.save();
    res.status(201).json(vote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVote = async (req, res) => {
  try {
    const updated = await Vote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteVote = async (req, res) => {
  try {
    await Vote.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
