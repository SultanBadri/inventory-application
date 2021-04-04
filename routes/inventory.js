var express = require("express");
var router = express.Router();
const weapon_controller = require("../controllers/weaponController");
const category_controller = require("../controllers/categoryController");

/* GET inventory. */
router.get("/", weapon_controller.weapon_list);

module.exports = router;
