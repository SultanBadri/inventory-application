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
  url,
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
    url: url,
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
          "https://static.wikia.nocookie.net/fallout/images/7/79/FO4_44_revolver.png/revision/latest?cb=20200517120419",
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
          "https://static.wikia.nocookie.net/fallout/images/c/c8/Fallout4_10mm_pistol.png/revision/latest/scale-to-width/360?cb=20210221201508",
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
          "https://static.wikia.nocookie.net/fallout/images/7/78/AssaultrifleFO4.png/revision/latest?cb=20210325181834",
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
          "https://static.wikia.nocookie.net/fallout/images/1/16/FO4LaserMusket.png/revision/latest?cb=20180104230937",
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
          "https://static.wikia.nocookie.net/fallout/images/3/3c/Fallout4_laser_pistol.png/revision/latest?cb=20190808164830",
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
          "https://static.wikia.nocookie.net/fallout/images/b/bc/FO76_Gamma_gun.png/revision/latest?cb=20190214211416",
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
          "https://static.wikia.nocookie.net/fallout/images/0/05/Fallout4_Pulse_grenade.png/revision/latest?cb=20160118224031",
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
          "https://static.wikia.nocookie.net/fallout/images/a/a9/Fo4FH_bear_trap.png/revision/latest?cb=20200225210908",
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
          "https://static.wikia.nocookie.net/fallout/images/3/3e/Ripper_%28Fallout_4%29.png/revision/latest?cb=20200312212308",
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
          "https://static.wikia.nocookie.net/fallout/images/c/c4/Fallout4_boxing_glove.png/revision/latest/scale-to-width/360?cb=20180113141023",
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
