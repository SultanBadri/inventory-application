const async = require("async");
const Weapon = require("../models/weapon");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

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
      if (results.weapon == null) {
        // No results
        var err = new Error("Weapon not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("weapon_detail", {
        title: results.weapon.name,
        weapon_description: results.weapon.description,
        weapon_price: results.weapon.price,
        weapon_weight: results.weapon.weight,
        weapon_ammo: results.weapon.ammo,
        weapon_range: results.weapon.range,
        weapon_accuracy: results.weapon.accuracy,
        weapon_clipSize: results.weapon.clipSize,
        weapon_damage: results.weapon.damage,
        weapon_src: results.weapon.src,
        category_list: results.categories,
      });
    }
  );
};

// Display weapon create form on GET.
exports.weapon_create_get = function (req, res, next) {
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
      res.render("weapon_form", {
        title: "Create Weapon",
        category_list: results.categories,
      });
    }
  );
};

// Handle Weapon create on POST.
exports.weapon_create_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("weapon_form", {
        title: "Create Weapon",
        weapon: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create an Weapon object with escaped and trimmed data.
      var weapon = new Weapon({
        description: req.body.description,
        price: req.body.price,
        weight: req.body.weight,
        ammo: req.body.ammo,
        range: req.body.range,
        accuracy: req.body.accuracy,
        clipSize: req.body.clipSize,
        damage: req.body.damage,
        src: req.body.src,
      });
      weapon.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new weapon record.
        res.redirect(weapon.url);
      });
    }
  },
];
