const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
const characterController = require("../controllers/characterController");
const seatController = require("../controllers/seatController");
const aiController = require("../controllers/aiController");
const searchController = require("../controllers/searchController");

router.get("/house/:houseName", houseController.getHouseData);
router.get("/character/:characterName", characterController.getCharacterData);
router.get("/seat/:seatName", seatController.getSeatData);
router.get("/ai/:info", aiController.getAIResponse);
router.get("/search/:type", searchController.search);

module.exports = router;
