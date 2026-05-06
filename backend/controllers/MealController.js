// import User from "../model/User.js";
// import Meal from "../model/Meal.js";

// // ─── POST /api/meals/add ─────────────────────────────────────────────────────
// // Protected route — attach verifyToken middleware on the router
// export async function addMeal(req, res) {
//     console.log("hii1")
//   try {
//     const userId = req.user.id; // set by verifyToken middleware
//  console.log("hii2")
//     const { name, date, items } = req.body;
//  console.log("hii3")
//     // ── 1. Basic validation ──────────────────────────────────────────────────
//     if (!name || !name.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Meal name is required",
//       });
//     }
//  console.log("hii4")
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one meal item is required",
//       });
//     }
//  console.log("hii5")
//     // ── 2. Validate & sanitize each item ────────────────────────────────────
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];

//       if (!item.name || !item.name.trim()) {
//         return res.status(400).json({
//           success: false,
//           message: `Item at index ${i} is missing a name`,
//         });
//       }

//       // Coerce numeric fields — default to 0 if absent / NaN
//       item.calories = Number(item.calories) || 0;
//       item.protein  = Number(item.protein)  || 0;
//       item.carbs    = Number(item.carbs)    || 0;
//       item.fat      = Number(item.fat)      || 0;

//       // Optional image URL — keep only if it's a non-empty string
//       if (item.imageUrl && typeof item.imageUrl !== "string") {
//         delete item.imageUrl;
//       }
//     }
//  console.log("hii7")
//     // ── 3. Resolve date (default to now) ────────────────────────────────────
//     const mealDate = date ? new Date(date) : new Date();

//     if (isNaN(mealDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid date format",
//       });
//     }
//  console.log("hii8")
//     // ── 4. Create & save (pre-save hook auto-calculates totals) ─────────────
//     const meal = await Meal.create({
//       userId,
//       name:  name.trim(),
//       date:  mealDate,
//       items,
//       // totals is computed by the pre-save hook — no need to pass it
//     });
//  console.log("hii111")
//     return res.status(201).json({
//       success: true,
//       message: "Meal added successfully",
//       meal,
//     });

//   } catch (error) {
//     console.error("addMeal error:", error);

//     // Mongoose validation errors
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((e) => e.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(", "),
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// }

// // ─── GET /api/meals ──────────────────────────────────────────────────────────
// // Returns all meals for the logged-in user, newest first
// export async function getUserMeals(req, res) {
//   try {
//     const userId = req.user.id;
//     const meals  = await Meal.findByUser(userId);

//     return res.status(200).json({
//       success: true,
//       count:   meals.length,
//       meals,
//     });
//   } catch (error) {
//     console.error("getUserMeals error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// // ─── GET /api/meals/date/:date ───────────────────────────────────────────────
// // Returns meals for a specific date  (YYYY-MM-DD)
// export async function getMealsByDate(req, res) {
//   try {
//     const userId = req.user.id;
//     const { date } = req.params;

//     if (!date) {
//       return res.status(400).json({ success: false, message: "Date is required" });
//     }

//     const meals = await Meal.findByUserAndDate(userId, date);

//     // Aggregate day totals across all meals
//     const dayTotals = meals.reduce(
//       (acc, meal) => {
//         acc.calories += meal.totals.calories;
//         acc.protein  += meal.totals.protein;
//         acc.carbs    += meal.totals.carbs;
//         acc.fat      += meal.totals.fat;
//         return acc;
//       },
//       { calories: 0, protein: 0, carbs: 0, fat: 0 }
//     );

//     return res.status(200).json({
//       success:   true,
//       date,
//       count:     meals.length,
//       dayTotals,
//       meals,
//     });
//   } catch (error) {
//     console.error("getMealsByDate error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }
import Meal from "../model/Meal.js";
import User from "../model/User.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toUtcMidnight(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function sanitizeItems(items) {
  return items.map((item, i) => {
    if (!item.name || !String(item.name).trim()) {
      throw Object.assign(new Error(`Item at index ${i} is missing a name`), {
        status: 400,
      });
    }
    return {
      name:     String(item.name).trim(),
      calories: Math.max(0, Number(item.calories) || 0),
      protein:  Math.max(0, Number(item.protein)  || 0),
      carbs:    Math.max(0, Number(item.carbs)    || 0),
      fat:      Math.max(0, Number(item.fat)      || 0),
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : null,
    };
  });
}

function handleError(res, error) {
  console.error("[MealController]", error);

  if (error.status) {
    return res.status(error.status).json({ success: false, message: error.message });
  }
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }
  return res.status(500).json({ success: false, message: "Internal server error" });
}

// ─── POST /api/meals ──────────────────────────────────────────────────────────
// Body: { name, date?, items: [{ name, calories, protein, carbs, fat, imageUrl? }] }
// ─── POST /api/meals ──────────────────────────────────────────────────────────
export async function addMeal(req, res) {
  try {
    const userId = req.user.id;
    const { name, date, items } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Meal name is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    const sanitized = sanitizeItems(items);

    // ── 1. Get a clean "YYYY-MM-DD" string ───────────────────────────────────
    const dateStr = date
      ? String(date).slice(0, 10)           // trust client: "2026-05-06"
      : (() => {
          const d = new Date();
          // Build from LOCAL parts — toISOString() would give UTC date (wrong in IST)
          return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0"),
          ].join("-");
        })();

    // ── 2. Store as noon UTC — safe across every timezone ────────────────────
    // noon UTC can never shift to a different calendar date in any timezone
    const mealDate = new Date(`${dateStr}T12:00:00.000Z`);

    if (isNaN(mealDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // ── 3. Range query for the day — never rely on exact timestamp match ──────
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd   = new Date(`${dateStr}T23:59:59.999Z`);

    let meal = await Meal.findOne({
      userId,
      date: { $gte: dayStart, $lte: dayEnd },  // ✅ range, not exact match
    });

    if (meal) {
      meal.items.push(...sanitized);
      await meal.save();
      return res.status(200).json({ success: true, message: "Items added to today's meal", meal });
    } else {
      meal = await new Meal({
        userId,
        name: String(name).trim(),
        date: mealDate,                          // stored as noon UTC
        items: sanitized,
      }).save();
      return res.status(201).json({ success: true, message: "Meal created", meal });
    }

  } catch (err) {
    return handleError(res, err);
  }
}
// ─── GET /api/meals?date=YYYY-MM-DD ──────────────────────────────────────────
// Returns meals + daily nutrition totals vs user's calorie goal
export async function getMealsByDate(req, res) {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const targetDate = date ? toUtcMidnight(date) : (() => {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      return d;
    })();

    if (!targetDate) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    // Fetch meals & user in parallel
    const [meals, user] = await Promise.all([
      Meal.findByUserAndDate(userId, targetDate),
      User.findById(userId).select("calorieGoal proteinGoal carbsGoal fatGoal").lean(),
    ]);

    // Aggregate daily totals in-app (avoids a second DB round-trip)
    const dailyTotals = meals.reduce(
      (acc, m) => {
        acc.calories += m.totals.calories;
        acc.protein  += m.totals.protein;
        acc.carbs    += m.totals.carbs;
        acc.fat      += m.totals.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return res.status(200).json({
      success: true,
      date: targetDate,
      goals: {
        calories: user?.calorieGoal ?? 2000,
        protein:  user?.proteinGoal ?? 150,
        carbs:    user?.carbsGoal   ?? 250,
        fat:      user?.fatGoal     ?? 65,
      },
      totals: dailyTotals,
      meals,
    });
  } catch (err) {
    return handleError(res, err);
  }
}

// ─── GET /api/meals/monthly ───────────────────────────────────────────────────
// Fetches last 30 days of meals in one call.
// Frontend caches this and filters by date locally — no repeated API hits.
export async function getMonthlyMeals(req, res) {
  try {
    const userId = req.user.id;

    // ── Fix 1: range must cover full day, use end-of-day not midnight ────────
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);          // ✅ don't cut off noon-stored docs

    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setUTCDate(todayStart.getUTCDate() - 30);

    const meals = await Meal.find({
      userId,
      date: { $gte: thirtyDaysAgo, $lte: todayEnd }, // ✅ full day included
    })
      .sort({ date: 1 })
      .lean();

    // ── Fix 2: group by UTC date string — all your docs are stored in UTC ────
    // Doc1: 2026-05-04T18:30Z → toISOString → "2026-05-04" (the IST midnight offset)
    // Doc2: 2026-05-05T12:00Z → toISOString → "2026-05-05"
    // Doc3: 2026-05-06T12:00Z → toISOString → "2026-05-06"
    // Use toISOString() here — your DB values ARE UTC, so UTC date string is correct
    const grouped = {};

    for (const meal of meals) {
      const dateKey = meal.date.toISOString().slice(0, 10); // "2026-05-06"

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          items: [],
        };
      }

      grouped[dateKey].totals.calories += meal.totals.calories;
      grouped[dateKey].totals.protein  += meal.totals.protein;
      grouped[dateKey].totals.carbs    += meal.totals.carbs;
      grouped[dateKey].totals.fat      += meal.totals.fat;
      grouped[dateKey].items.push(...meal.items);
    }

    const user = await User.findById(userId)
      .select("calorieGoal proteinGoal carbsGoal fatGoal")
      .lean();

    return res.status(200).json({
      success: true,
      goals: {
        calories: user?.calorieGoal ?? 2000,
        protein:  user?.proteinGoal ?? 150,
        carbs:    user?.carbsGoal   ?? 250,
        fat:      user?.fatGoal     ?? 65,
      },
      data: grouped,
    });

  } catch (err) {
    return handleError(res, err);
  }
}
// ─── GET /api/meals/history ───────────────────────────────────────────────────
// Returns per-day summaries for calendar/history view
export async function getMealHistory(req, res) {
  try {
    const userId = req.user.id;
    const summary = await Meal.getDailySummary(userId);
    return res.status(200).json({ success: true, history: summary });
  } catch (err) {
    return handleError(res, err);
  }
}

// ─── DELETE /api/meals/:id ────────────────────────────────────────────────────
export async function deleteMeal(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const meal = await Meal.findOneAndDelete({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    return res.status(200).json({ success: true, message: "Meal deleted" });
  } catch (err) {
    return handleError(res, err);
  }
}