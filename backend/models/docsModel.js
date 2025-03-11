const mongoose = require("mongoose");

const DocumentationSchema = new mongoose.Schema({
  filename: String,
  content: String,
}, { timestamps: true });

module.exports = mongoose.model("Documentation", DocumentationSchema);
