const {calculateNutrition} = require("../controllers/NutritionController")
const express = require("express");
const router = express.Router();
router.post("/",calculateNutrition)
module.exports = router;