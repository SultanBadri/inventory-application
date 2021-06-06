const async = require("async");
const Weapon = require("../models/weapon");
const Category = require("../models/category");

// list all weapons of a category
exports.category_game_list = function (req, res, next) {
  async.parallel(
    {
      weapons: function (callback) {
        Weapon.find({ categories: req.params.id })
          .sort([["name", "ascending"]])
          .populate("categories")
          .exec(callback);
      },
      categories: function (callback) {
        Category.find()
          .sort([["name", "ascending"]])
          .exec(callback);
      },
      selected_category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      // Successful, so render
      results.weapons.map((weapon) => {
        const sortedArr = weapon.categories.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });

        return { ...weapon._doc, categories: sortedArr };
      });

      res.render("category", {
        title: results.selected_category.name,
        weapon_list: results.weapons,
        category_list: results.categories,
        selected_category: results.selected_category,
      });
    }
  );
};
