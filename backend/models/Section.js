const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true }, // Association à Menu
});

module.exports = mongoose.model('Section', sectionSchema);
