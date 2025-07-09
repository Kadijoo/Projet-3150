const MenuItem = require("../models/MenuItem");

exports.getMenuItems = async (req, res) => {
  try {
    const { menuId } = req.params;
    const items = await MenuItem.find({ menu: menuId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des items", err });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { nom, description, position, statut } = req.body;

    const item = new MenuItem({
      menu: menuId,
      nom,
      description,
      position,
      statut
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'item", err });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { menuId, itemId } = req.params;
    const updates = req.body;

    const item = await MenuItem.findOneAndUpdate(
      { _id: itemId, menu: menuId },
      updates,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "MenuItem non trouvé pour ce menu." });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'item", err });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { menuId, itemId } = req.params;

    const item = await MenuItem.findOneAndDelete({ _id: itemId, menu: menuId });

    if (!item) {
      return res.status(404).json({ message: "MenuItem non trouvé pour ce menu." });
    }

    res.status(200).json({ message: "Item supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'item", err });
  }
};
