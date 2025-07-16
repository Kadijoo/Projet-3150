const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
  contenu: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 1000
  },
  note: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  date_avis: {
    type: Date,
    default: Date.now
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cible: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "cibleModel"
  },
  cibleModel: {
    type: String,
    required: true,
    enum: ["Menu", "Plat"]
  }
});

module.exports = mongoose.model("Avis", avisSchema);