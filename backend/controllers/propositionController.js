const Proposition = require("../models/Proposition");

// Créer une proposition
exports.createProposition = async (req, res) => {
  try {
    const proposition = new Proposition(req.body);
    await proposition.save();
    res.status(201).json(proposition);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la proposition", error: err });
  }
};

// Récupérer toutes les propositions
exports.getAllPropositions = async (req, res) => {
  try {
    const propositions = await Proposition.find()
      .populate("menuItem")
      .populate("utilisateur");
    res.status(200).json(propositions);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des propositions", error: err });
  }
};

// Récupérer une proposition par ID
exports.getPropositionById = async (req, res) => {
  try {
    const proposition = await Proposition.findById(req.params.id)
      .populate("menuItem")
      .populate("utilisateur");

    if (!proposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }

    res.status(200).json(proposition);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err });
  }
};

// Mettre à jour une proposition
exports.updateProposition = async (req, res) => {
  try {
    const proposition = await Proposition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // <-- Ajout important
    );

    if (!proposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }

    res.status(200).json(proposition);
  } catch (err) {
    console.error("Erreur updateProposition:", err.message); // Ajout pour debug
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};


// Supprimer une proposition
exports.deleteProposition = async (req, res) => {
  try {
    const proposition = await Proposition.findByIdAndDelete(req.params.id);
    if (!proposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }
    res.status(200).json({ message: "Proposition supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err });
  }
};
