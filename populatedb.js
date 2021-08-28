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

function weaponCreate(
  name,
  description,
  category,
  price,
  weight,
  ammo,
  range,
  accuracy,
  clipSize,
  damage,
  src,
  cb
) {
  weaponDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    weight: weight,
    ammo: ammo,
    range: range,
    accuracy: accuracy,
    clipSize: clipSize,
    damage: damage,
    src: src,
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
          4.2,
          ".44 round",
          83,
          65,
          6,
          48,
          "https://imgr.search.brave.com/YeoSDvG980-MBl-b7xwINq1kdXDZTo4BQeGQO5B7lMo/fit/1200/923/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvMS8xMy80NF9w/aXN0b2wucG5nL3Jl/dmlzaW9uL2xhdGVz/dD9jYj0yMDE1MTEy/MjE1MTExNw",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "10mm pistol",
          "The 10mm pistol is one of the first weapons found inside Vault 111 (after the security baton), located in the overseer's office.",
          categories[0],
          50,
          3.5,
          "10mm round",
          83,
          60,
          12,
          18,
          "https://imgr.search.brave.com/XH9qfWd39Y7ciESY-5NTZe1izTnI2zwODBDrQVDXuag/fit/1200/943/ce/1/aHR0cDovL3ZpZ25l/dHRlNC53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvYi9iYS8xMG1t/X2xvbmdfYmFycmVs/LnBuZy9yZXZpc2lv/bi9sYXRlc3Q_Y2I9/MjAxNjAzMTcwNDM2/MDU",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Assault Rifle",
          "DFed from a side-mounted magazine, this assault rifle has anti-aircraft style sights and interchangeable barrels and magazines.",
          categories[0],
          144,
          13.4,
          "5.56 round",
          119,
          72,
          30,
          30,
          "https://imgr.search.brave.com/QkJl8_jOaygp1-n24rTNbFbq_d8H19Xf0BYbrb6RhSc/fit/1200/980/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvNy83OC9Bc3Nh/dWx0cmlmbGVGTzQu/cG5nL3JldmlzaW9u/L2xhdGVzdD9jYj0y/MDE3MDExMjAxNDEz/MA",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Laser musket",
          "The laser musket is a homemade, nonstandard version of a laser rifle.",
          categories[1],
          40,
          8,
          "Fusion cell",
          71,
          70,
          1,
          30,
          "https://imgr.search.brave.com/mTJdJtmFGYGqdtxmSCtD-DOTGz1cTeOtQFlaZz2LsJ8/fit/1200/554/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvMS8xNi9GTzRM/YXNlck11c2tldC5w/bmcvcmV2aXNpb24v/bGF0ZXN0P2NiPTIw/MTgwMTA0MjMwOTM3",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Laser gun",
          "The AER9 was actually not the top laser rifle in service at the time of the Great War.",
          categories[1],
          66,
          3.9,
          "Fusion cell",
          71,
          71,
          30,
          24,
          "https://imgr.search.brave.com/Tq0HqZyF0TZU6pIP3ttWwEueMDY13LLaay_K3D6udas/fit/1200/842/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvMy8zYy9GYWxs/b3V0NF9sYXNlcl9w/aXN0b2wucG5nL3Jl/dmlzaW9uL2xhdGVz/dD9jYj0yMDE3MDEx/ODA0MTQ0Mg",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Gamma gun",
          "The gamma gun is a very crude weapon overall and appears to have been built from scavenged junk found throughout the wasteland.",
          categories[2],
          156,
          3,
          "Gamma round",
          119,
          69,
          8,
          100,
          "https://imgr.search.brave.com/8W6sPTyGOlCqiqNLja1YFW4QZ51xoh3Ko18EdrvBP5I/fit/925/706/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvZi9mMi9HYW1t/YV9ndW5fKEZhbGxv/dXRfNCkucG5nL3Jl/dmlzaW9uL2xhdGVz/dD9jYj0yMDE3MTIw/NDIyNTEwOA",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Pulse grenade",
          "The pulse grenade emits a burst of energy that deal 150 damage over 1 second to enemies.",
          categories[3],
          100,
          0.5,
          "N/A",
          93,
          "N/A",
          "N/A",
          150,
          "https://imgr.search.brave.com/EmPqXCnRA58Uh5RjmZFAEUiPtacNQVIhh-PjQSCKdvM/fit/737/709/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvMC8wNS9GYWxs/b3V0NF9QdWxzZV9n/cmVuYWRlLnBuZy9y/ZXZpc2lvbi9sYXRl/c3Q_Y2I9MjAxNjAx/MTgyMjQwMzE",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Bear trap",
          "The bear trap is a reusable mine type weapon. Unlike normal mines, it does not have an area of effect.",
          categories[4],
          75,
          8,
          "N/A",
          93,
          0,
          "N/A",
          34,
          "https://imgr.search.brave.com/gNF6axaaDBOr0-oBlF4Tqp5QzEyvNi4TsAR4fJTjFuo/fit/1200/702/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvYS9hOS9GbzRG/SF9iZWFyX3RyYXAu/cG5nL3JldmlzaW9u/L2xhdGVzdD9jYj0y/MDE2MDUyNDIyMTgy/Mg",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Ripper",
          "A short-bladed, chainsaw-like device that was used by the military before the Great War, most likely used both as a weapon and as a general-purpose cutting tool.",
          categories[5],
          50,
          6,
          "N/A",
          0.8,
          "N/A",
          "N/A",
          4,
          "https://imgr.search.brave.com/DLhlUQIKM0SudsB7thZZfKTN3KGevUMcm2PoNZgTUpk/fit/1200/690/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvMy8zZS9SaXBw/ZXJfKEZhbGxvdXRf/NCkucG5nL3Jldmlz/aW9uL2xhdGVzdD9j/Yj0yMDE1MTExNTE4/MDE1NQ",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Boxing gloves",
          "The boxing glove is a large, red leather mitt laced onto the wearer's right hand.",
          categories[6],
          10,
          1,
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          9,
          "https://imgr.search.brave.com/K1mqSIlWZcs6IIjYpwbmHrKeNkBBngUFVi2pEUMi6cw/fit/1037/1014/ce/1/aHR0cHM6Ly9mYWxs/b3V0LmdhbWVwZWRp/YS5jb20vbWVkaWEv/ZmFsbG91dC5nYW1l/cGVkaWEuY29tL2Uv/ZTgvRm80X0dsb3Zl/LnBuZw",
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Acid Soaker",
          "The Acid Soaker is a small pistol of the same model as the Deliverer that has been jury-rigged to fire acid concentrate from a small glass container rather than 10mm rounds.",
          categories[7],
          125,
          3,
          "Acid concentrate",
          35,
          89,
          20,
          10,
          "https://imgr.search.brave.com/ORdrAKIe_IU_Q7gmMrBjfGTYfs1U_UPms6-yeBY3d2I/fit/849/618/ce/1/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZmFsbG91dC9pbWFn/ZXMvZi9mMi9BY2lk/c29ha2VyLnBuZy9y/ZXZpc2lvbi9sYXRl/c3Q_Y2I9MjAxNjA4/MjYwNjU1NTQ",
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
