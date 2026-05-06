const {calculateNutrition ,analyzeText} = require("../controllers/NutritionController");
const isLoggedIn = require("../middleware/UserAuth");
const express = require("express");
const router = express.Router();
router.post("/",calculateNutrition);
router.post("/analyze-text" , analyzeText);
module.exports = router;