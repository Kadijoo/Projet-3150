const Section = require("../models/Section");

// Créer une section
exports.createSection = async (req, res) => {
  try {
    const { nom, menu } = req.body;

    const section = new Section({ nom, menu });
    await section.save();

    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la section", error: err });
  }
};

// Récupérer toutes les sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('menu'); // si tu veux inclure les infos du menu
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des sections", error: err });
  }
};

// Récupérer une section par ID
exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate('menu');
    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la section", error: err });
  }
};

// Mettre à jour une section
exports.updateSection = async (req, res) => {
  try {
    const { nom, menu } = req.body;
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { nom, menu },
      { new: true }
    );
    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la section", error: err });
  }
};

// Supprimer une section
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }
    res.status(200).json({ message: "Section supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la section", error: err });
  }
};
