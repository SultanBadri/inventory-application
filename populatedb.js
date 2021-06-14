// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Category = require("./models/category");
var Weapon = require("./models/weapon");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var weapons = [];

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description || "" });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function weaponCreate(name, description, category, price, cb) {
  weaponDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
  };

  var weapon = new Weapon(weaponDetail);

  weapon.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Weapon: " + weapon);
    weapons.push(weapon);
    cb(null, weapon);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Ballistic Weapons",
          "They come with bullets.",
          callback
        );
      },
      function (callback) {
        categoryCreate("Energy Weapons", "Guns with fusion cells.", callback);
      },
      function (callback) {
        categoryCreate("Radiation Weapons", "Gamma/acid guns.", callback);
      },
      function (callback) {
        categoryCreate("Explosives", "Grenades.", callback);
      },
      function (callback) {
        categoryCreate("Traps", "You don't want to run into these!", callback);
      },
      function (callback) {
        categoryCreate(
          "Melee Weapons",
          "Handheld, close combat weapons.",
          callback
        );
      },
      function (callback) {
        categoryCreate("Unarmed Weapons", "Your fists.", callback);
      },
      function (callback) {
        categoryCreate(
          "Poison Weapons",
          "Explosives with side effects.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createWeapons(cb) {
  async.parallel(
    [
      function (callback) {
        weaponCreate(
          ".44 pistol",
          "The .44 pistol is a double-action revolver, chambered in the .44 Magnum cartridge, with a blued finish and wooden grips.",
          categories[0],
          99,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "10mm pistol",
          "The 10mm pistol is one of the first weapons found inside Vault 111 (after the security baton), located in the overseer's office.",
          categories[0],
          50,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Assault Rifle",
          "DFed from a side-mounted magazine, this assault rifle has anti-aircraft style sights and interchangeable barrels and magazines.",
          categories[0],
          144,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Laser musket",
          "The laser musket is a homemade, nonstandard version of a laser rifle.",
          categories[1],
          57,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createWeapons],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Weapons: " + weapons);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
