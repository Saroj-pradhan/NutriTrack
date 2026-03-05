const {calculateNutrition} = require("../controllers/NutritionController")
const express = require("express");
const router = express.Router();
router.get("/",calculateNutrition)
module.exports = router;