const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 100 },
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
