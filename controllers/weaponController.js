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
        weapon_url: results.weapon.url,
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
  body("name").trim().isLength({ min: 1 }).escape(),
  body("category").trim().isLength({min: 1}).escape(),
  body("description").trim().isLength({ min: 1 }).escape(),
  body("damage").trim().isLength({min: 1}).escape(),
  body("price").trim().isLength({ min: 1 }).escape(),
  body("weight").trim().isLength({ min: 1 }).escape(),
  body("ammo").trim().isLength({ min: 1 }).escape(),
  body("range").trim().isLength({ min: 1 }).escape(),
  body("accuracy").trim().isLength({ min: 1 }).escape(),
  body("clipSize").trim().isLength({ min: 1 }).escape(),
  body("src").trim().isLength({ min: 1 }).escape(),

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
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        damage: req.body.damage,
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

// Display weapon delete form on GET.
exports.weapon_delete_get = function(req, res, next) {

  async.parallel({
      weapon: function(callback) {
          Weapon.findById(req.params.id).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.weapon==null) { // No results.
          res.redirect('/inventory');
      }
      // Successful, so render.
      res.render('weapon_delete', { title: 'Delete Weapon', weapon: results.weapon } );
  });
};

// Handle Weapon delete on POST.
exports.weapon_delete_post = function(req, res, next) {

    async.parallel({
        weapon: function(callback) {
          Weapon.findById(req.body.weaponid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
          // Success
          // Delete weapon and redirect to the list of weapons.
          Weapon.findByIdAndRemove(req.body.weaponid, function deleteWeapon(err) {
            if (err) { return next(err); }
              // Success - go to weapons list
              res.redirect('/inventory')
          })
    });
};