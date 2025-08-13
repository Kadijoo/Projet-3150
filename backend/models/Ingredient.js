const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie", required: true },
  //description: { type: String, trim: true }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);