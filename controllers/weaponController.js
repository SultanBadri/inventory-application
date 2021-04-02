const async = require("async");
const Weapon = require("../models/weapon");

// List all the weapons
exports.weapon_list = function (req, res, next) {
  async.parallel({
    weapons: function (callback) {
      Weapon.find({})
        .sort([["name", "ascending"]])
        .populate("categories")
        .exec(callback);
    },
    // Successful, so render
    res.render("weapon_list", {
      title: "Weapon List",
    })
  });
};
