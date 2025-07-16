const Vote = require("../models/Vote");

// ✅ Créer un vote
exports.createVote = async (req, res) => {
  try {
    const { type, cible, cibleModel, auteur } = req.body;

    // Vérifier si l'utilisateur a déjà voté sur cette cible
    const existingVote = await Vote.findOne({ cible, cibleModel, auteur });
    if (existingVote) {
      return res.status(400).json({ error: "Vous avez déjà voté pour cet élément." });
    }

    const vote = new Vote({ type, cible, cibleModel, auteur });
    await vote.save();

    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du vote", error: err });
  }
};

// ✅ Récupérer tous les votes
exports.getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate("auteur")
      .populate("cible"); // `refPath` permet la résolution dynamique

    res.status(200).json(votes);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des votes", error: err });
  }
};

// ✅ Récupérer un vote par ID
exports.getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id)
      .populate("auteur")
      .populate("cible");

    if (!vote) {
      return res.status(404).json({ message: "Vote non trouvé" });
    }

    res.status(200).json(vote);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du vote", error: err });
  }
};

// ✅ Supprimer un vote
exports.deleteVote = async (req, res) => {
  try {
    const vote = await Vote.findByIdAndDelete(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: "Vote non trouvé" });
    }

    res.status(200).json({ message: "Vote supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du vote", error: err });
  }
};
