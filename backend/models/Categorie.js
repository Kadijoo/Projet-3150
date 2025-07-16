const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, trim: true }
});

module.exports = mongoose.model("Categorie", categorieSchema);