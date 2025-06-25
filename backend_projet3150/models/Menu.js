const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
  liste_plat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plat" }],
  feedback: String,
  suggestions: String,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
});

module.exports = mongoose.model("Menu", menuSchema);
