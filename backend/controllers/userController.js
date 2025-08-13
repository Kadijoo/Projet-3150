
const jwt = require("jsonwebtoken");
//console.log("✅ userController loaded");
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
    const { nom, email, mot_passe } = req.body;

    const newRestaurateur = new User({
      nom,
      email,
      mot_passe,
      type_utilisateur: "restaurateur"
    });

    await newRestaurateur.save();
    res.status(201).json({ message: "Restaurateur enregistré avec succès", user: newRestaurateur });
  } catch (err) {
    console.error("❌ Erreur registerRestaurateur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};





/*exports.registerRestaurateur = async (req, res) => {
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
};*/

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

    // Met à jour la date de dernière connexion
    user.derniere_connexion = new Date();
    await user.save();

    // Crée le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      message: "Connexion réussie",
      token, // 🔥 Ici le token est renvoyé
      utilisateur: {
        id: user._id,
        nom: user.nom || user.nom_restaurant,
        type: user.type_utilisateur,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/*exports.login = async (req, res) => {
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

    utilisateur.derniere_connexion = new Date();
    await utilisateur.save();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const { _id, nom, nom_restaurant, email, type, derniere_connexion } = req.user;

    res.json({
      id: _id,
      nom,
      nom_restaurant,
      email,
      type,
      derniere_connexion
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement du profil" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    res.json({
      nom: req.user.nom,
      email: req.user.email,
      lastLogin: req.user.lastLogin,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};


exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    req.user.photo = req.file.filename;
    await req.user.save();

    res.status(200).json({ message: "Photo mise à jour", photo: req.user.photo });
  } catch (error) {
    console.error("Erreur upload :", error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
};


