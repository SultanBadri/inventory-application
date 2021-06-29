var express = require("express");
var router = express.Router();
const weapon_controller = require("../controllers/weaponController");
const category_controller = require("../controllers/categoryController");

// GET home page
router.get("/", weapon_controller.weapon_list);

// GET request for one weapon
router.get("/weapon/:id", weapon_controller.weapon_detail);

// GET category view
router.get("/category/:id", category_controller.category_game_list);

module.exports = router;
