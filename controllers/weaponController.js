const async = require("async");
const Weapon = require("../models/weapon");
const Category = require("../models/category");

// List of all weapons
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
          .sort([["name", "ascending"]])
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      // Successful, so render
      results.weapons.map((weapon) => {
        return weapon;
      });

      res.render("weapon_list", {
        title: "All Weapons",
        weapon_list: results.weapons,
        category_list: results.categories,
      });
    }
  );
};
