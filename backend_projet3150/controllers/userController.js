const User = require("../models/User");
const jwt = require("jsonwebtoken");


exports.registerClient = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;
    const user = new User({
      nom,
      email,
      mot_de_passe, // pense à hasher ensuite
      type_utilisateur: "client"
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur enregistré." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.registerRestaurateur = async (req, res) => {
  try {
    const {
      nom, email, mot_de_passe, telephone, adresse,
      type_cuisine, logo, description
    } = req.body;

    const user = new User({
      nom,
      email,
      mot_de_passe,
      type_utilisateur: "restaurateur"
      // Optionnel : tu peux aussi enregistrer un modèle `Restaurant` ici
    });

    await user.save();
    res.status(201).json({ message: "Restaurateur enregistré." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, mot_de_passe, type_utilisateur } = req.body;

  try {
    const user = await User.findOne({ email, type_utilisateur });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.mot_de_passe !== mot_de_passe) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    res.json({
      message: "Connexion réussie",
      utilisateur: {
        id: user._id,
        nom: user.nom,
        type: user.type_utilisateur
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};