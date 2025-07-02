const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  titre: String,
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
});

module.exports = mongoose.model('Section', sectionSchema);
