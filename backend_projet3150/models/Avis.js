const mongoose = require("mongoose");
const avisSchema = new mongoose.Schema({
  nom_auteur: String,
  description: String,
  note: { type: Number, required: true, min: 1, max: 5 },
  date_avis: { type: Date, default: Date.now },
  feedback: Boolean,
  suggestions: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  plat: { type: mongoose.Schema.Types.ObjectId, ref: "Plat" },
});

module.exports = mongoose.model("Avis", avisSchema);

