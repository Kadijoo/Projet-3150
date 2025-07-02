const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  position: { type: Number, required: true, min: 0 },
  nom: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  statut: {
    type: String,
    enum: ["actif", "inactif", "en_attente"], 
    default: "actif"
  },
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
