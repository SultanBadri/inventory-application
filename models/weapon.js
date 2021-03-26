const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponsCategory = new Schema({
  name: { type: String, maxLength: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Weapon" required: true },
  price: { type: Number, required: true },
});

// Virtual for weapon's URL
WeaponsCategory.virtual("url").get(function () {
  return "/weapon/" + this._id;
});

// Export model
module.exports = mongoose.model("Weapons", WeaponsCategory);
