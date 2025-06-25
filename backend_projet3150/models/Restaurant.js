const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  nom: String,
  adresse: String,
  rating: Number,
  review: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
  plats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plat" }]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
