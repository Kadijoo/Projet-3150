const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  type: { type: String, enum: ["UP", "DOWN"], required: true },
  date_vote: { type: Date, default: Date.now },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Un vote doit avoir un auteur"]
  },
  cible: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Une cible est requise"],
    refPath: "cibleModel"
  },
  cibleModel: {
    type: String,
    required: [true, "Le modèle cible est requis"],
    enum: ["Menu", "Plat", "Avis"]
  }
});

module.exports = mongoose.model("Vote", voteSchema);