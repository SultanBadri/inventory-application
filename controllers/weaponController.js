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

// Detail weapon page for a specific weapon
exports.weapon_detail = function (req, res, next) {
  async.parallel(
    {
      weapon: function (callback) {
        Weapon.findById(req.params.id)
          .populate("weapon")
          .populate("category")
          .exec(callback);
      },
      weapon_instance: function (callback) {
        Weapon.find({ weapon: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.weapon == null) {
        // No results
        var err = new Error("Weapon not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("weapon_detail", {
        title: results.weapon.name,
        weapon: results.weapon,
        weapon_instance: results.weapon_instance,
      });
    }
  );
};
