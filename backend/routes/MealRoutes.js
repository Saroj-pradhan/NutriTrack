const {addMeal , getMealsByDate , getMonthlyMeals , getMealHistory} = require("../controllers/MealController");
const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/UserAuth");
router.post("/addmeal",isLoggedIn,addMeal);
router.get("/mealbydate",isLoggedIn,getMealsByDate);
router.get("/monthly",isLoggedIn,getMonthlyMeals);
router.get("/history",isLoggedIn,getMealHistory);
module.exports = router;