const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom_restaurant: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, match: /.+\@.+\..+/ },
  mot_passe: { type: String, required: true, minlength: 6 },
  type_utilisateur: { type: String, enum: ["client", "restaurateur"], required: true },
  score_credibilite: { type: Number, default: 0 },
  date_inscription: { type: Date, default: Date.now },

  // Champs spécifiques aux restaurateurs (facultatifs pour les clients)
  telephone: { type: String },
  adresse: { type: String },
  type_cuisine: { type: String, enum: ["africaine", "asiatique", "européenne", "fusion", "autre"] },
  logo: { type: String, match: /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)$/i },
  description: { type: String }
});

module.exports = mongoose.model("User", userSchema);
