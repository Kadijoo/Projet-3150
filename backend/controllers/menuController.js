const Menu = require("../models/Menu");

exports.createMenu = async (req, res) => {
  try {
    const { titre, description, type, statut, disponible, restaurant } = req.body;

    if (!titre || !restaurant) {
      return res.status(400).json({ message: "Les champs 'titre' et 'restaurant' sont requis." });
    }

    const newMenu = new Menu({
      titre,
      type,
      description: description || "",
      statut: statut || "actif",
      disponible: disponible !== undefined ? disponible : true,
      restaurant
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Obtenir tous les menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate("restaurant");
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMenusWithPlats = async (req, res) => {
  try {
    const menus = await Menu.find()
      .populate("restaurant")
      .populate({
        path: "plats",
        populate: [
          {
            path: "ingredients",
            populate: { path: "categorie" }
          },
          {
            path: "auteur",
            select: "nom_restaurant"
          }
        ]
      });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// menuController.js — getMenusWithPlats (patch)
/*exports.getMenusWithPlats = async (req, res) => {
  try {
    const menus = await Menu.find({})
      .populate({
        path: "plats",
        populate: [
          { path: "categorie", select: "nom" },
          { path: "auteur", select: "_id nom nom_restaurant" },
          // 👇 AJOUT: ingrédients + leur catégorie
          { path: "ingredients", populate: { path: "categorie", select: "nom" } },
        ],
      })
      // garde ton populate restaurant si tu l’as
      .populate({
        path: "restaurant",
        select: "nom proprietaire",
        populate: { path: "proprietaire", select: "_id nom nom_restaurant" },
      })
      .lean();
    res.json(menus);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
*/


//  Obtenir un menu par ID
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate("restaurant")
      .populate({
        path: "plats",
        populate: [
          {
            path: "ingredients",
            populate: { path: "categorie" }
          },
          {
            path: "auteur", // si tu veux aussi le nom du resto
            select: "nom_restaurant"
          }
        ]
      });

    if (!menu) {
      return res.status(404).json({ message: "Menu non trouvé." });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMenusByRestaurateurId = async (req, res) => {
  try {
    const { id } = req.params;

    const menus = await Menu.find({ restaurant: id })
      .populate({
        path: "plats",
        populate: {
          path: "ingredients",
          populate: {
            path: "categorie",
            model: "Categorie",
          },
        },
      })
      .populate("restaurant", "nom_restaurant");

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


//  Mettre à jour un menu
exports.updateMenu = async (req, res) => {
  try {
    const { titre, description, statut, disponible } = req.body;

    const updates = {
      ...(titre && { titre }),
      ...(description && { description }),
      ...(statut && { statut }),
      ...(disponible !== undefined && { disponible }),
      date_dern_modification: Date.now()
    };

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu non trouvé." });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Supprimer un menu
exports.deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Menu non trouvé." });
    }

    res.status(200).json({ message: "Menu supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMenusByRestaurant = async (req, res) => {
  try {
    const menus = await Menu.find({ restaurant: req.params.restaurantId });
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du chargement des menus", err });
  }
};

exports.createMenuForRestaurant = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const menu = new Menu({
      titre,
      description,
      restaurant: req.params.restaurantId
    });
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du menu", err });
  }
};


exports.updateMenuOfRestaurant = async (req, res) => {
  try {
    const { restaurantId, menuId } = req.params;
    const updates = req.body;

    const menu = await Menu.findOneAndUpdate(
      { _id: menuId, restaurant: restaurantId },
      updates,
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu non trouvé pour ce restaurant." });
    }

    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du menu.", err });
  }
};

exports.deleteMenuOfRestaurant = async (req, res) => {
  try {
    const { restaurantId, menuId } = req.params;

    const menu = await Menu.findOneAndDelete({ _id: menuId, restaurant: restaurantId });

    if (!menu) {
      return res.status(404).json({ message: "Menu non trouvé pour ce restaurant." });
    }

    res.status(200).json({ message: "Menu supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du menu.", err });
  }
};