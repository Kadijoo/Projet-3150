const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  type_utilisateur: { type: String, enum: ["client", "restaurateur"], required: true },
  score_credibilite: { type: Number, default: 0 },
  date_inscription: { type: Date, default: Date.now },

  // Champs spécifiques aux restaurateurs (facultatifs pour les clients)
  telephone: { type: String },
  adresse: { type: String },
  type_cuisine: { type: String },
  logo: { type: String },
  description: { type: String }
});

module.exports = mongoose.model("User", userSchema);
