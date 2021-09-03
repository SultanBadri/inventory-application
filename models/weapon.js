const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
  name: { type: String, maxlength: 100 },
  description: { type: String, required: true, maxlength: 250 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 0, max: 100000 },
  weight: { type: Number, required: true },
  ammo: { type: String, required: true, maxlength: 100 },
  range: { type: Schema.Types.Mixed, required: true },
  accuracy: { type: Schema.Types.Mixed, required: true },
  clipSize: { type: Schema.Types.Mixed, required: true },
  damage: { type: Number, required: true, min: 0 },
  src: { type: String, required: true },
});

// Virtual for weapon's URL
WeaponSchema.virtual("url").get(function () {
  return "/inventory/weapons/" + this._id;
});

// Export model
module.exports = mongoose.model("Weapon", WeaponSchema);
