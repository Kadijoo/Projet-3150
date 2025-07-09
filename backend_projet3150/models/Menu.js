const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  statut: {
    type: String,
    enum: ["actif", "inactif", "archive"],
    default: "actif"
  },
  date_creation: { type: Date, default: Date.now },
  date_dern_modification: { type: Date, default: Date.now },
  disponible: { type: Boolean, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }
});

module.exports = mongoose.model("Menu", menuSchema);
