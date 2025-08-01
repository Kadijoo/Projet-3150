const mongoose = require("mongoose");

const propositionSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  statut: { 
    type: String, 
    enum: ["en attente", "acceptée", "rejetée"], 
    default: "en attente" 
  },
  date_creation: { type: Date, default: Date.now },
  soumis: { type: Boolean, default: false },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  
});

module.exports = mongoose.model("Proposition", propositionSchema);