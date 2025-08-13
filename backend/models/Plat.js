const mongoose = require("mongoose");

const platSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prix: { type: Number, required: true, min: 0 },
  description: {type: String, default: "" },
  tags: { type: [String], default: [] },
  image: { type: String, required: [true, "L'image du restaurant est requise"] },
  auteur: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
  ingredients: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  default: []
},
  menu: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Menu"}
});


module.exports = mongoose.model("Plat", platSchema);