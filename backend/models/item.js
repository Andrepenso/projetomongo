const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
});

module.exports = mongoose.model("Item", ItemSchema);
