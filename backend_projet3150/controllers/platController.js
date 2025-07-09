
const Plat = require("../models/Plat");
const Menu = require("../models/Menu");

exports.getAll = async (req, res) => {
  try {
    const plats = await Plat.find();
    res.json(plats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlatsByMenu = async (req, res) => {
  try {
    const plats = await Plat.find({ menu: req.params.menuId });
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPlatForMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(404).json({ error: "Menu non trouvé." });

    const plat = new Plat({
      ...req.body,
      menu: req.params.menuId
    });
    await plat.save();
    res.status(201).json(plat);
  } catch (error) {
    console.error("Erreur création plat:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePlatInMenu = async (req, res) => {
  try {
    const { menuId, platId } = req.params;
    const updates = req.body;

    const plat = await Plat.findOne({ _id: platId, menu: menuId });
    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé dans ce menu." });
    }

    const updatedPlat = await Plat.findByIdAndUpdate(
      platId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPlat);
  } catch (error) {
    console.error("Erreur updatePlatInMenu:", error.message);
    console.error("Requête reçue:", req.body);
    res.status(400).json({ message: "Erreur lors de la mise à jour du plat.", error: error.message });
  }
};

exports.deletePlatFromMenu = async (req, res) => {
  try {
    const { menuId, platId } = req.params;

    const plat = await Plat.findOne({ _id: platId, menu: menuId });
    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé dans ce menu." });
    }

    await Plat.findByIdAndDelete(platId);
    res.status(200).json({ message: "Plat supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deletePlatFromMenu:", error.message);
    res.status(500).json({ message: "Erreur lors de la suppression du plat." });
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
    const plat = await Plat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé" });
    }

    res.status(200).json(plat);
  } catch (err) {
    console.error("Mise à jour échouée:", err.message);
    console.error("Requête reçue:", req.body);
    console.log("Requête de mise à jour reçue:", req.body);
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


exports.addIngredientToPlat = async (req, res) => {
  try {
    const { platId } = req.params;
    const { nom, categorie, description } = req.body;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    plat.ingredients.push({ nom, categorie, description });
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateIngredient = async (req, res) => {
  try {
    const { platId, ingredientIndex } = req.params;
    const { nom, categorie, description } = req.body;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    const i = parseInt(ingredientIndex);
    if (!plat.ingredients[i]) return res.status(404).json({ message: "Ingrédient introuvable" });

    plat.ingredients[i] = { nom, categorie, description };
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeIngredient = async (req, res) => {
  try {
    const { platId, ingredientIndex } = req.params;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    const i = parseInt(ingredientIndex);
    if (!plat.ingredients[i]) return res.status(404).json({ message: "Ingrédient introuvable" });

    plat.ingredients.splice(i, 1);
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*const Plat = require("../models/Plat");

exports.getAll = async (req, res) => {
  try {
    const plats = await Plat.find();
    res.json(plats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlatsByMenu = async (req, res) => {
  try {
    const plats = await Plat.find({ menu: req.params.menuId });
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPlatForMenu = async (req, res) => {
  try {
    const plat = new Plat({
      ...req.body,
      menu: req.params.menuId
    });
    await plat.save();
    res.status(201).json(plat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updatePlatInMenu = async (req, res) => {
  try {
    const { menuId, platId } = req.params;
    const updates = req.body;

    // Vérifie que le plat appartient bien au menu
    const plat = await Plat.findOne({ _id: platId, menu: menuId });
    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé dans ce menu." });
    }

    // Met à jour les champs
    const updatedPlat = await Plat.findByIdAndUpdate(platId, updates, { new: true });
    res.status(200).json(updatedPlat);
  } catch (error) {
    console.error("Erreur updatePlatInMenu:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du plat.", error });
  }
};



exports.deletePlatFromMenu = async (req, res) => {
  try {
    const { menuId, platId } = req.params;

    // Vérifie que le plat appartient bien au menu
    const plat = await Plat.findOne({ _id: platId, menu: menuId });
    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé dans ce menu." });
    }

    // Supprime le plat
    await Plat.findByIdAndDelete(platId);
    res.status(200).json({ message: "Plat supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deletePlatFromMenu:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du plat.", error });
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
    const plat = await Plat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé" });
    }

    res.status(200).json(plat);
  } catch (err) {
    console.error("Mise à jour échouée:", err.message);
  console.error("Requête reçue:", req.body);
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


exports.addIngredientToPlat = async (req, res) => {
  try {
    const { platId } = req.params;
    const { nom, categorie, description } = req.body;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    plat.ingredients.push({ nom, categorie, description });
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateIngredient = async (req, res) => {
  try {
    const { platId, ingredientIndex } = req.params;
    const { nom, categorie, description } = req.body;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    const i = parseInt(ingredientIndex);
    if (!plat.ingredients[i]) return res.status(404).json({ message: "Ingrédient introuvable" });

    plat.ingredients[i] = { nom, categorie, description };
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeIngredient = async (req, res) => {
  try {
    const { platId, ingredientIndex } = req.params;

    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    const i = parseInt(ingredientIndex);
    if (!plat.ingredients[i]) return res.status(404).json({ message: "Ingrédient introuvable" });

    plat.ingredients.splice(i, 1);
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/
