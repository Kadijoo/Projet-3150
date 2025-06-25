const Menu = require("../models/Menu");

exports.createMenu = async (req, res) => {
  try {
    const { liste_plat, feedback, suggestions, restaurant } = req.body;

    const newMenu = new Menu({
      liste_plat,
      feedback,
      suggestions,
      restaurant
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find()
      .populate("liste_plat") // pour afficher les plats liés
      .populate("restaurant");
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un menu par ID
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate("liste_plat")
      .populate("restaurant");

    if (!menu) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un menu
exports.updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un menu
exports.deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};