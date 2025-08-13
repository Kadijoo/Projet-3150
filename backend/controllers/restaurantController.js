const Restaurant = require("../models/Restaurant");

const User = require("../models/User");


exports.create = async (req, res) => {
  try {
    console.log("req.body =", req.body);
    console.log("req.file =", req.file);
    
    const { nom, adresse, ville, description, proprietaire } = req.body;

    // 1. Vérifier que le propriétaire est bien un utilisateur existant
    const user = await User.findById(proprietaire);
    if (!user) {
      return res.status(404).json({ error: "Propriétaire introuvable." });
    }

    // 2. Vérifier qu'il est bien de type "restaurateur"
    if (user.type_utilisateur !== "restaurateur") {
      return res.status(400).json({ error: "Seuls les restaurateurs peuvent créer un restaurant." });
    }

    // 3. Vérifier que l'image a bien été envoyée
    if (!req.file) {
      return res.status(400).json({ error: "L'image du restaurant est requise." });
    }

    // 4. Créer le restaurant avec le chemin de l’image
    const restaurant = new Restaurant({
      nom,
      adresse,
      ville,
      description,
      proprietaire,
      image: `/images/${req.file.filename}` // chemin de l'image sur le serveur
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*exports.getRestaurants = async (req, res) => {
  try {
    const restos = await Restaurant.find({})
      .populate({ path: "proprietaire", select: "_id nom nom_restaurant" })
      .lean();
    res.json(restos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};*/

exports.getAll = async (req, res) => {
  try {
    const data = await Restaurant.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant non trouvé" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: "Restaurant non trouvé" });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant non trouvé" });
    res.json({ message: "Restaurant supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







