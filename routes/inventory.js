var express = require("express");
var router = express.Router();
const weapon_controller = require("../controllers/weaponController");
const category_controller = require("../controllers/categoryController");

/* GET inventory. */
router.get("/", function (req, res, next) {
  res.send("NOT IMPLEMENTED YET");
});

module.exports = router;
