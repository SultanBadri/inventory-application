const async = require("async");
const Weapon = require("../models/weapon");
const Category = require("../models/category");

// List all the weapons
exports.weapon_list = function (req, res, next) {
  async.parallel(
    {
      weapons: function (callback) {
        Weapon.find({})
          .sort([["name", "ascending"]])
          .populate("categories")
          .exec(callback);
      },
      categories: function (callback) {
        Category.find()
          .sort([["name", "asc"]])
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("index", {
        title: "Weapons list",
        weapon_list: results.weapons,
        category_list: results.categories,
      });
    }
  );
};
