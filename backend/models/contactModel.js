const {Schema, model} = require("../connection");

const contactSchema = new Schema({
  name: String,
    email: { type: String},
    message: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = model("contacts", contactSchema);