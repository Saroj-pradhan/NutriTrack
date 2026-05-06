// const mongoose = require('mongoose');

// const mealSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now,
//     index: true,
//   },
//   items: [
//     {
//       name: { type: String, required: true, trim: true },
//       calories: { type: Number, default: 0 },
//       protein: { type: Number, default: 0 },
//       carbs: { type: Number, default: 0 },
//       fat: { type: Number, default: 0 },
//        imageUrl: {
//     type: String
//   },
//     },
//   ],
//   totals: {
//     calories: { type: Number, default: 0 },
//     protein: { type: Number, default: 0 },
//     carbs: { type: Number, default: 0 },
//     fat: { type: Number, default: 0 },
//   },
// }, {
//   timestamps: true,
// });

// mealSchema.statics.findByUser = function(userId) {
//   return this.find({ userId }).sort({ date: -1 });
// };

// mealSchema.statics.findByUserAndDate = function(userId, date) {
//   const start = new Date(date);
//   start.setHours(0, 0, 0, 0);
//   const end = new Date(date);
//   end.setHours(23, 59, 59, 999);
//   return this.find({ userId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
// };
// mealSchema.pre("save", function () {
//   const totals = {
//     calories: 0,
//     protein: 0,
//     carbs: 0,
//     fat: 0
//   };

//   this.items.forEach(item => {
//     totals.calories += item.calories;
//     totals.protein += item.protein;
//     totals.carbs += item.carbs;
//     totals.fat += item.fat;
//   });

//   this.totals = totals;
// });
// module.exports = mongoose.model('Meal', mealSchema);

import mongoose from "mongoose";

// ─── Sub-schema for individual food items ────────────────────────────────────
const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    calories: { type: Number, default: 0, min: 0 },
    protein:  { type: Number, default: 0, min: 0 },
    carbs:    { type: Number, default: 0, min: 0 },
    fat:      { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: null },
  },
  { _id: true }
);

// ─── Main Meal Schema ─────────────────────────────────────────────────────────
const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },

    // Store as UTC midnight so date-range queries are simple
    date: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
      },
    },

    items: { type: [itemSchema], default: [] },

    // Auto-computed by pre-save hook — never set manually
    totals: {
      calories: { type: Number, default: 0 },
      protein:  { type: Number, default: 0 },
      carbs:    { type: Number, default: 0 },
      fat:      { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Compound index: fast lookup by user + date (the most common query pattern)
mealSchema.index({ userId: 1, date: 1 });

// ─── Helper: normalise any Date/string to UTC midnight ───────────────────────
function toUtcMidnight(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// ─── Pre-save hook: compute totals from items ─────────────────────────────────
mealSchema.pre("save", function () {
  this.totals = this.items.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein  += item.protein;
      acc.carbs    += item.carbs;
      acc.fat      += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
});

// ─── Static: all meals for a user, newest first ──────────────────────────────
mealSchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ date: -1 });
};

// ─── Static: all meals for a user on a specific date ─────────────────────────
mealSchema.statics.findByUserAndDate = function (userId, date) {
  const day = toUtcMidnight(date);
  return this.find({ userId, date: day }).sort({ createdAt: 1 });
};

// ─── Static: daily nutrition summary for a user ───────────────────────────────
// Returns an array of { date, totalCalories, totalProtein, totalCarbs, totalFat, meals[] }
// sorted newest-first. Pass `date` to restrict to a single day.
mealSchema.statics.getDailySummary = async function (userId, date) {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };

  if (date) {
    matchStage.date = toUtcMidnight(date);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$date",
        totalCalories: { $sum: "$totals.calories" },
        totalProtein:  { $sum: "$totals.protein" },
        totalCarbs:    { $sum: "$totals.carbs" },
        totalFat:      { $sum: "$totals.fat" },
        meals: {
          $push: {
            _id:    "$_id",
            name:   "$name",
            items:  "$items",
            totals: "$totals",
          },
        },
      },
    },
    {
      $project: {
        _id:           0,
        date:          "$_id",
        totalCalories: 1,
        totalProtein:  1,
        totalCarbs:    1,
        totalFat:      1,
        meals:         1,
      },
    },
    { $sort: { date: -1 } },
  ]);
};

export default mongoose.model("Meal", mealSchema);
