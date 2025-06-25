const mongoose = require("mongoose");

const PlatSchema = new mongoose.Schema({
  nom_plat: { type: String, required: true },
  description: { type: String },
  ingredients: { type: String },
  feedback: { type: String },
  suggestions: { type: String },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }, // clé étrangère
});

module.exports = mongoose.model("Plat", PlatSchema);