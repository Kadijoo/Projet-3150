const Proposition = require("../models/Proposition");

exports.createProposition = async (req, res) => {
  try {
    const proposition = new Proposition(req.body);
    await proposition.save();
    res.status(201).json(proposition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPropositions = async (req, res) => {
  try {
    const propositions = await Proposition.find();
    res.json(propositions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProposition = async (req, res) => {
  try {
    const updated = await Proposition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProposition = async (req, res) => {
  try {
    await Proposition.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};