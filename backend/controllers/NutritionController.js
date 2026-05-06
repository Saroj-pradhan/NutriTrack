// import ApiError from "../utils/ApiErrror.js";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// dotenv.config();
// import axios from "axios";

// export const calculateNutrition = async function (req, res) {
//   try {
//     const { image_b64, mime_type = "image/jpeg" } = req.body;

//     if (!image_b64) throw new ApiError(404, "Base64 image not found");

//     // Step 1: Identify food via Gemini Vision
//     const description = await AnalyzeImage(image_b64, mime_type);

//     res.status(200).json({
//       description,
//       // nutrition,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(error.statusCode || 500).json({  // ✅ fixed typo
//       error: error.message || "Server error",
//     });
//   }
// };

// // ─── Gemini Vision ───────────────────────────────────────────────
// async function AnalyzeImage(image_b64, mime_type) {
//   try {
//     const ai = new GoogleGenAI({ apiKey: process.env.Google_Api });

//     const response = await ai.models.generateContent({
//       // model: "gemini-2.5-flash",gemini-1.5-flash
//       model: "gemini-2.5-flash",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//   "text": `Analyze this image.

// Step 1: Determine if the image contains food.

// - If NOT food:
//   return:
//   { "status": 422, "message": "This is not a image of food" }

// - If food but unclear:
//   return:
//   { "status": 400, "message": "unclear food detection" }

// - If food is detected:
//   return JSON in this format:

// {
//   "status": 200,
//   "items": [
//     {
//       "name": "food name",
//       "calories": number (per 100g),
//       "protein": number,
//       "carbs": number,
//       "fat": number,
//     }
//   ]
// }

// IMPORTANT:
// - Return ONLY JSON
// - No explanation
// - Use realistic nutrition values per 100g`
// },
//             {
//               inlineData: {
//                 mimeType: mime_type,  // ✅ dynamic mime type
//                 data: image_b64,
//               },
//             },
//           ],
//         },
//       ],
//     });

    
//     const raw =  response.text; // or however you get response

//  const description =  cleanJSONResponse(raw);

// const data = JSON.parse(description);
//     console.log("AI Description:", data);
//     return data;
//   } catch (error) {
//     console.error(error);
//     throw new ApiError(502, "Error analyzing image with Gemini");
//   }
// }

// // ─── Query Cleaner ───────────────────────────────────────────────
// function cleanJSONResponse(text) {
//   return text
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();
// }


// async function fetchNutritionFromUSDA(query) {
//   try {
//     const apiKey = process.env.USDA_API_KEY || "DEMO_KEY"; // Free at api.nal.usda.gov
    
//     const searchRes = await axios.get("https://api.nal.usda.gov/fdc/v1/foods/search", {
//       params: {
//         query,
//         api_key: apiKey,
//         pageSize: 1,
//         dataType: "Foundation,SR Legacy", // Raw/natural foods
//       },
//     });

//     const foods = searchRes.data.foods;
//     if (!foods || foods.length === 0) {
//       throw new ApiError(404, `Nutrition data not found for: ${query}`);
//     }

//     const food = foods[0];

//     // Helper to extract nutrient by ID
//     const getNutrient = (id) =>
//       food.foodNutrients?.find((n) => n.nutrientId === id)?.value || 0;

//     return {
//       name: food.description || query,
//       calories: getNutrient(1008),   // Energy (kcal)
//       protein: getNutrient(1003),    // Protein (g)
//       fat: getNutrient(1004),        // Total fat (g)
//       carbs: getNutrient(1005),      // Carbohydrates (g)
//       fiber: getNutrient(1079),      // Fiber (g)
//       sugar: getNutrient(2000),      // Sugar (g)
//       per: "100g",
//     };
//   } catch (error) {
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(502, "Error fetching nutrition from USDA");
//   }
// }

import ApiError from "../utils/ApiErrror.js";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.Google_Api }); // init once, not per request

// ─── Retry wrapper ────────────────────────────────────────────────────────────
// Retries up to `maxRetries` times on 429 / 503 (Gemini busy) errors
async function withRetry(fn, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const status = err?.status ?? err?.code ?? err?.statusCode;
      const isBusy = status === 429 || status === 503 ||
        err?.message?.toLowerCase().includes("resource exhausted") ||
        err?.message?.toLowerCase().includes("overloaded");

      if (!isBusy) throw err; // don't retry on non-busy errors (bad request, auth, etc.)

      if (attempt < maxRetries) {
        // Exponential back-off: 1s, 2s, 4s
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.warn(`[Gemini] Busy (attempt ${attempt}/${maxRetries}) — retrying in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  console.error(`[Gemini] Failed after ${maxRetries} attempts`);
  throw lastError;
}

// ─── POST /api/nutrition/analyze ─────────────────────────────────────────────
export const calculateNutrition = async function (req, res) {
  try {
    const { image_b64, mime_type = "image/jpeg" } = req.body;

    if (!image_b64) {
      return res.status(400).json({ success: false, message: "Base64 image is required" });
    }

    const result = await analyzeImage(image_b64, mime_type);

    // Pass Gemini's status code up to the client
    return res.status(result.status === 200 ? 200 : result.status).json({
      success: result.status === 200,
      ...result,
    });

  } catch (error) {
    console.error("[calculateNutrition]", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ─── Gemini Vision ────────────────────────────────────────────────────────────
async function analyzeImage(image_b64, mime_type) {
  const prompt = `Analyze this food image carefully.

STEP 1 — Is there food in this image?

If NO food detected:
Return exactly:
{ "status": 422, "message": "No food detected in this image" }

If food is present but too blurry/unclear to identify:
Return exactly:
{ "status": 400, "message": "Food detected but image is too unclear to analyze" }

If food is clearly detected:
Return exactly this JSON structure:
{
  "status": 200,
  "items": [
    {
      "name": "exact food name",
      "serving_unit": "g" or "ml",
      "calories": <number per 100g or 100ml>,
      "protein": <number per 100g or 100ml>,
      "carbs": <number per 100g or 100ml>,
      "fat": <number per 100g or 100ml>
    }
  ]
}

RULES:
- Detect EVERY distinct food item separately (e.g. rice + chicken + salad = 3 items)
- All nutrition values are PER 100g (solids) or PER 100ml (liquids)
- Use realistic, accurate nutrition values
- Return ONLY valid JSON — no markdown, no explanation, no extra text`;

  const raw = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mime_type,
                data: image_b64,
              },
            },
          ],
        },
      ],
    });
    return response.text;
  }, 3); // retry up to 3 times

  const cleaned = cleanJSON(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[analyzeImage] Failed to parse Gemini response:", cleaned);
    throw new ApiError(502, "Gemini returned an invalid response. Please try again.");
  }

  return parsed;
}

// ─── Strip markdown code fences if Gemini adds them ──────────────────────────
function cleanJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}


// // ─── POST /api/nutrition/analyze-text ────────────────────────────────────────
// export const analyzeText = async function (req, res) {
//   try {
//     const { description } = req.body;

//     if (!description || !String(description).trim()) {
//       return res.status(400).json({ success: false, message: "Meal description is required" });
//     }

//     const result = await analyzeTextDescription(String(description).trim());

//     return res.status(result.status === 200 ? 200 : result.status).json({
//       success: result.status === 200,
//       ...result,
//     });

//   } catch (error) {
//     console.error("[analyzeText]", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Server error",
//     });
//   }
// };

// // ─── Gemini Text Analysis ─────────────────────────────────────────────────────
// async function analyzeTextDescription(description) {
//   const prompt = `You are a nutrition expert. Analyze the following meal description and return nutrition data.

// Meal description: "${description}"

// If the description is clearly not food related:
// Return exactly:
// { "status": 422, "message": "This doesn't appear to be a food description" }

// If food items are identified:
// Return exactly this JSON structure:
// {
//   "status": 200,
//   "items": [
//     {
//       "name": "exact food name",
//       "serving_unit": "g" or "ml",
//       "calories": <number per 100g or 100ml>,
//       "protein": <number per 100g or 100ml>,
//       "carbs": <number per 100g or 100ml>,
//       "fat": <number per 100g or 100ml>
//     }
//   ]
// }

// RULES:
// - Detect EVERY distinct food item separately
// - All nutrition values are PER 100g (solids) or PER 100ml (liquids)
// - Liquids like milk, juice, tea → serving_unit: "ml"
// - Solids → serving_unit: "g"
// - Use realistic, accurate nutrition values
// - Return ONLY valid JSON — no markdown, no explanation`;

//   const raw = await withRetry(async () => {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });
//     return response.text;
//   }, 3);

//   const cleaned = cleanJSON(raw);

//   let parsed;
//   try {
//     parsed = JSON.parse(cleaned);
//   } catch {
//     throw new ApiError(502, "Gemini returned an invalid response. Please try again.");
//   }

//   return parsed;
// }

// ─── POST /api/nutrition/analyze-text ────────────────────────────────────────
export const analyzeText = async function (req, res) {
  try {
    const { description } = req.body;

    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: "Meal description is required" });
    }

    const result = await analyzeTextDescription(String(description).trim());

    return res.status(result.status === 200 ? 200 : result.status).json({
      success: result.status === 200,
      ...result,
    });

  } catch (error) {
    console.error("[analyzeText]", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ─── Groq Text Analysis ───────────────────────────────────────────────────────
async function analyzeTextDescription(description) {
  const prompt = `You are a nutrition expert. Analyze the following meal description and return nutrition data.

Meal description: "${description}"

If the description is clearly not food related:
Return exactly:
{ "status": 422, "message": "This doesn't appear to be a food description" }

If food items are identified:
Return exactly this JSON structure:
{
  "status": 200,
  "items": [
    {
      "name": "exact food name",
      "serving_unit": "g" or "ml",
      "calories": <number per 100g or 100ml>,
      "protein": <number per 100g or 100ml>,
      "carbs": <number per 100g or 100ml>,
      "fat": <number per 100g or 100ml>
    }
  ]
}

RULES:
- Detect EVERY distinct food item separately
- All nutrition values are PER 100g (solids) or PER 100ml (liquids)
- Liquids like milk, juice, tea → serving_unit: "ml"
- Solids → serving_unit: "g"
- Use realistic, accurate nutrition values
- Return ONLY valid JSON — no markdown, no explanation`;

  const raw = await withRetrys(async () => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // best Groq model for structured output
      max_tokens: 1024,
      temperature: 0.1,                  // low temp = more consistent JSON
      response_format: { type: "json_object" }, // forces valid JSON output
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert. Always respond with valid JSON only. No markdown, no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return response.choices[0].message.content;
  }, 3);

  const cleaned = cleanJSON(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new ApiError(502, "Failed to parse nutrition response. Please try again.");
  }

  return parsed;
}

// ─── Retry with exponential back-off ─────────────────────────────────────────
async function withRetrys(fn, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const status = err?.status ?? err?.statusCode;

      const isBusy =
        status === 429 || status === 503 ||
        err?.message?.toLowerCase().includes("rate limit") ||
        err?.message?.toLowerCase().includes("overloaded") ||
        err?.message?.toLowerCase().includes("service unavailable");

      if (!isBusy) throw err; // bad request, auth error — fail immediately

      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s → 2s → 4s
        console.warn(`[Groq] Busy (attempt ${attempt}/${maxRetries}) — retrying in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  console.error("[Groq] Failed after all retries");
  throw new ApiError(503, "AI service is busy. Please try again in a moment.");
}