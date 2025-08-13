const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom du restaurant est requis"]
  },
  adresse: {
    type: String,
    required: [true, "L'adresse est requise"]
  },
  ville: {
    type: String,
    required: [true, "La ville est requise"]
  },
  description: {
    type: String,
    default: ""
  },
  image: {
  type: String,
  required: [true, "L'image du restaurant est requise"]
},

  note: {
    type: Number,
    min: [0, "La note ne peut pas être inférieure à 0"],
    max: [5, "La note ne peut pas dépasser 5"],
    default: 0
  },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
