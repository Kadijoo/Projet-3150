const Avis = require("../models/Avis");

exports.create = async (req, res) => {
  try {
    const avis = new Avis(req.body);
    await avis.save();
    res.status(201).json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const avis = await Avis.find().populate("restaurant").populate("user");
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id).populate("restaurant").populate("user");
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const avis = await Avis.find({ utilisateur: req.params.userId }).populate("plat").populate("menu");
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndDelete(req.params.id);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json({ message: "Avis supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

