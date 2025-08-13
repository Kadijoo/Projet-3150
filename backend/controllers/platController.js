
const Plat = require("../models/Plat");
const Menu = require("../models/Menu");
//const Plat = require("../models/Plat");
const Categorie = require("../models/Categorie");
const Ingredient = require("../models/Ingredient");
const Restaurant = require("../models/Restaurant");
//const Menu = require("../models/Menu");
//const tags = req.body.tags;



/*exports.getAll = async (req, res) => {
  try {
    const plats = await Plat.find();
    res.json(plats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

exports.getAll = async (req, res) => {
  try {
    const plats = await Plat.find({ auteur: req.user._id }) // uniquement les plats du restaurateur connecté
      .populate({
        path: "ingredients",
        populate: {
          path: "categorie",
          model: "Categorie",
        },
      });

    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des plats" });
  }
};

// 🔹 Récupérer tous les plats (pour affichage public)
// Récupérer tous les plats sans filtrage
exports.getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.find()
      .populate({
        path: "ingredients",
        populate: { path: "categorie" }
      })
      .populate({
        path: "auteur",
        select: "nom_restaurant _id"
      });

    res.status(200).json(plats);
  } catch (error) {
    console.error("Erreur getAllPlats:", error);
    res.status(500).json({ error: error.message });
  }
};
// platController.js — getPlats (patch)
exports.getPlats = async (req, res) => {
  try {
    const plats = await Plat.find({})
      .populate({ path: "categorie", select: "nom" })
      .populate({ path: "auteur", select: "_id nom nom_restaurant" })
      // 👇 AJOUT: ingrédients + leur catégorie
      .populate({ path: "ingredients", populate: { path: "categorie", select: "nom" } })
      .lean();
    res.json(plats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// platController.js — getById (patch)
exports.getPlats = async (req, res) => {
  try {
    const plats = await Plat.find({})
      .populate({ path: "categorie", select: "nom" })
      .populate({ path: "auteur", select: "_id nom nom_restaurant" })
      // 👇 AJOUT: ingrédients + leur catégorie
      .populate({ path: "ingredients", populate: { path: "categorie", select: "nom" } })
      .lean();
    res.json(plats);
  } catch (e) {
    res.status(500).json({ error: e.message });
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

    await Plat.findByIdAndUpdate(platId, { $unset: { menu: "" } }); // retire l'association
    await Menu.findByIdAndUpdate(menuId, { $pull: { plats: platId } });

    res.status(200).json({ message: "Plat retiré du menu avec succès." });
  } catch (error) {
    console.error("Erreur deletePlatFromMenu:", error.message);
    res.status(500).json({ message: "Erreur lors de la suppression du plat du menu." });
  }
};


/*exports.getById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id)
      .populate({
        path: "ingredients",
        populate: { path: "categorie", model: "Categorie", select: "nom" },
      })
      .populate({ path: "auteur", select: "nom_restaurant nom _id" })
      .populate("categorie", "nom");

    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });
    res.json(plat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

// platController.js — getById (patch)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const plat = await Plat.findById(id)
      .populate({ path: "categorie", select: "nom" })
      .populate({ path: "auteur", select: "_id nom nom_restaurant" })
      // 👇 AJOUT
      .populate({ path: "ingredients", populate: { path: "categorie", select: "nom" } })
      .lean();
    if (!plat) return res.status(404).json({ error: "Plat introuvable" });
    res.json(plat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};



exports.create = async (req, res) => {
  try {
    const { nom, prix, description, menu, auteur } = req.body;

    console.log("📥 Données reçues dans req.body:", req.body);
    console.log("📥 req.body.ingredients (brut):", req.body.ingredients);
    console.log("📥 req.body.tags (brut):", req.body.tags);

    let parsedTags = [];
    let parsedIngredients = [];

    // Parse les tags
    if (req.body.tags) {
      try {
        parsedTags = JSON.parse(req.body.tags);
        console.log("✅ Tags parsés =", parsedTags);
      } catch (error) {
        console.warn("⚠️ Tags non parsés :", error.message);
      }
    }

    // Parse les ingrédients groupés par catégorie
    if (req.body.ingredients) {
      try {
        parsedIngredients = JSON.parse(req.body.ingredients);
        console.log("✅ Ingredients parsés :", parsedIngredients);
      } catch (error) {
        console.warn("⚠️ Ingrédients non parsés :", error.message);
      }
    }

    const createdIngredients = [];

    for (const cat of parsedIngredients) {
      console.log("🔍 Nom de la catégorie reçue:", cat.nom);

      let existingCat = await Categorie.findOne({ nom: cat.nom });

      if (!existingCat) {
        console.log("➕ Catégorie non trouvée, création :", cat.nom);
        existingCat = await Categorie.create({ nom: cat.nom });
      } else {
        console.log("✅ Catégorie existante :", existingCat.nom);
      }

      // 🔁 Transformation automatique en tableau si besoin
      let ingredientList = Array.isArray(cat.ingredients)
        ? cat.ingredients
        : String(cat.ingredients).split(",").map((i) => i.trim());

      console.log("📦 Ingrédients normalisés :", ingredientList);

      for (const ingNom of ingredientList) {
        try {
          console.log("🍴 Création ingrédient :", ingNom, "dans catégorie", existingCat.nom);

          const ing = await Ingredient.create({
            nom: ingNom,
            categorie: existingCat._id,
          });

          console.log("✅ Ingrédient créé :", ing);
          createdIngredients.push(ing._id);
        } catch (error) {
          console.error("❌ Erreur création ingrédient :", error.message);
        }
      }
    }

    // Création du plat final
    const plat = new Plat({
      nom,
      auteur,
      prix,
      description,
      menu,
      tags: parsedTags,
      image: `/images/${req.file.filename}`,
      ingredients: createdIngredients,
    });

    console.log("🧾 Plat à enregistrer :", plat);
    await plat.save();
    console.log("✅ Plat enregistré avec succès :", plat);

    res.status(201).json(plat);
  } catch (err) {
    console.error("❌ Erreur création plat avec ingrédients :", err.message);
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


exports.associerPlatAuMenu = async (req, res) => {
  const { platId, menuId } = req.params;

  try {
    const plat = await Plat.findById(platId);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé" });

    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu non trouvé" });

    plat.menu = menuId;
    await plat.save();

    if (!menu.plats.includes(platId)) {
      menu.plats.push(platId);
      await menu.save();
    }

    res.status(200).json({ message: "Plat associé au menu", plat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getPlatsByRestaurateur = async (req, res) => {
  try {
    const plats = await Plat.find({ auteur: req.params.id })
  .populate("auteur", "nom_restaurant")
  .populate({
    path: "ingredients",
    populate: {
      path: "categorie",
      model: "Categorie",
    },
  });

    res.status(200).json(plats);
  } catch (error) {
    console.error("❌ Erreur récupération plats :", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getPlatsAvecNomRestaurant = async (req, res) => {
  try {
    const plats = await Plat.find({ auteur: req.params.id })
      .populate({
        path: "ingredients",
        populate: {
          path: "categorie"
        }
      });

    const results = await Promise.all(plats.map(async (plat) => {
      const restaurant = await Restaurant.findOne({ proprietaire: plat.auteur });
      return {
        ...plat.toObject(),
        nom_restaurant: restaurant ? restaurant.nom : "Nom non trouvé"
      };
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error("Erreur récupération plats avec nom restaurant :", err.message);
    res.status(500).json({ error: err.message });
  }
};


