const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  nom: String,
  adresse: String,
  ville: String,
  note: Number,
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
