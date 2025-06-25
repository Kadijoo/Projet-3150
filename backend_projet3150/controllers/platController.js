const Plat = require("../models/Plat");

exports.getAll = async (req, res) => {
  try {
    const plats = await Plat.find();
    res.json(plats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });
    res.json(plat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const plat = new Plat(req.body);
    await plat.save();
    res.status(201).json(plat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const plat = await Plat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });
    res.json(plat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const plat = await Plat.findByIdAndDelete(req.params.id);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });
    res.json({ message: "Plat supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
