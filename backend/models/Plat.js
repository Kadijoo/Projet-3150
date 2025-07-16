const mongoose = require("mongoose");

const platSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prix: { type: Number, required: true, min: 0 },
  tags: { type: [String], default: [] },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
  ingredients: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  default: []
},
  menu: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Menu", 
    required: true 
  }
});

module.exports = mongoose.model("Plat", platSchema);