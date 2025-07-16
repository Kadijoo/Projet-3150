const User = require("../models/User");

exports.registerClient = async (req, res) => {
  try {
    const { nom, email, mot_passe } = req.body;

    const user = new User({
      nom,
      email,
      mot_passe,
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
      nom_restaurant,
      email,
      mot_passe,
      telephone,
      adresse,
      type_cuisine,
      logo,
      description
    } = req.body;

    const user = new User({
      nom_restaurant,
      email,
      mot_passe,
      type_utilisateur: "restaurateur",
      telephone,
      adresse,
      type_cuisine,
      logo,
      description
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

    if (user.mot_passe !== mot_de_passe) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id: user._id,
        nom: user.nom || user.nom_restaurant,
        type: user.type_utilisateur
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
