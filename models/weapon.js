const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
  name: { type: String, maxlength: 100 },
  description: { type: String, required: true, maxlength: 250 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 0, max: 100000 },
});

// Virtual for weapon's URL
WeaponSchema.virtual("url").get(function () {
  return "/inventory/weapon/" + this._id;
});

// Export model
module.exports = mongoose.model("Weapon", WeaponSchema);
