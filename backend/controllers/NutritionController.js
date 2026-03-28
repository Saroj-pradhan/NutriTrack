import ApiError from "../utils/ApiErrror.js";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
import axios from "axios";

export const calculateNutrition = async function (req, res) {
  try {
    const { image_b64, mime_type = "image/jpeg" } = req.body;

    if (!image_b64) throw new ApiError(404, "Base64 image not found");

    // Step 1: Identify food via Gemini Vision
    const description = await AnalyzeImage(image_b64, mime_type);

    res.status(200).json({
      description,
      // nutrition,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({  // ✅ fixed typo
      error: error.message || "Server error",
    });
  }
};

// ─── Gemini Vision ───────────────────────────────────────────────
async function AnalyzeImage(image_b64, mime_type) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.Google_Api });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
  "text": `Analyze this image.

Step 1: Determine if the image contains food.

- If NOT food:
  return:
  { "status": 422, "message": "This is not a image of food" }

- If food but unclear:
  return:
  { "status": 400, "message": "unclear food detection" }

- If food is detected:
  return JSON in this format:

{
  "status": 200,
  "items": [
    {
      "name": "food name",
      "calories": number (per 100g),
      "protein": number,
      "carbs": number,
      "fat": number,
    }
  ]
}

IMPORTANT:
- Return ONLY JSON
- No explanation
- Use realistic nutrition values per 100g`
},
            {
              inlineData: {
                mimeType: mime_type,  // ✅ dynamic mime type
                data: image_b64,
              },
            },
          ],
        },
      ],
    });

    
    const raw =  response.text; // or however you get response

 const description =  cleanJSONResponse(raw);

const data = JSON.parse(description);
    console.log("AI Description:", data);
    return data;
  } catch (error) {
    console.error(error);
    throw new ApiError(502, "Error analyzing image with Gemini");
  }
}

// ─── Query Cleaner ───────────────────────────────────────────────
function cleanJSONResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

// ─── USDA FoodData Central ───────────────────────────────────────
async function fetchNutritionFromUSDA(query) {
  try {
    const apiKey = process.env.USDA_API_KEY || "DEMO_KEY"; // Free at api.nal.usda.gov
    
    const searchRes = await axios.get("https://api.nal.usda.gov/fdc/v1/foods/search", {
      params: {
        query,
        api_key: apiKey,
        pageSize: 1,
        dataType: "Foundation,SR Legacy", // Raw/natural foods
      },
    });

    const foods = searchRes.data.foods;
    if (!foods || foods.length === 0) {
      throw new ApiError(404, `Nutrition data not found for: ${query}`);
    }

    const food = foods[0];

    // Helper to extract nutrient by ID
    const getNutrient = (id) =>
      food.foodNutrients?.find((n) => n.nutrientId === id)?.value || 0;

    return {
      name: food.description || query,
      calories: getNutrient(1008),   // Energy (kcal)
      protein: getNutrient(1003),    // Protein (g)
      fat: getNutrient(1004),        // Total fat (g)
      carbs: getNutrient(1005),      // Carbohydrates (g)
      fiber: getNutrient(1079),      // Fiber (g)
      sugar: getNutrient(2000),      // Sugar (g)
      per: "100g",
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "Error fetching nutrition from USDA");
  }
}
// import ApiError from "../utils/ApiErrror.js";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// dotenv.config();
// import axios from "axios";
//  let result = "nothing";
 
 
// export const calculateNutrition = async function(req,res){
//     // console.log(req.body , "hay");

// try {
//      console.log("hay1");
//  console.log(process.env.Google_Api,"ppppppp");
  
//    const {image_b64} = req.body;
// //    console.log(image_b64,"imgg");
   
//    if(!image_b64) throw new ApiError(404,"base64 Image Not Found");
//      const description = await AnalyzeImage(image_b64);

//    // 👉 Step 2: Clean description
//    const query = description.replace("with", "").trim();
// //    const response =await axios.post("https://platform.fatsecret.com/rest/image-recognition/v2",{
// // image_b64:image_b64 
// //    },{
// // headers:{
// //     Authorization:`Bearer ${AcessToken}`
// // }
// // })
// // console.log(response,"respppp");

//  // 👉 Step 3: Call Open Food Facts
//    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=1`;

//    const response = await axios.get(url);
// console.log(response.data,"ressssssssss");

//    if(!response.data.products.length){
//        throw new ApiError(404,"Food not found");
//    }

//    const product = response.data.products[0];
//    const nutriments = product.nutriments || {};

//    const finalResult = {
//        name: product.product_name || "nothing",
//        calories: nutriments["energy-kcal_100g"] || 0,
//        protein: nutriments.proteins_100g || 0,
//        fat: nutriments.fat_100g || 0,
//        carbs: nutriments.carbohydrates_100g || 0,
//    };

//    res.status(200).json({
//        description:"ook",
//        nutrition: finalResult
//    });

//     // res.status(200).json({
//     //     "Foods":result,
//     // });
// } catch (error) {
//     res.status(error.statuscode || 504).json({
//         "error":error.message || "server error",
//     });
// }
// }

// async function AnalyzeImage(image_b64){
// try{
//     const ai  = new GoogleGenAI({
//         apiKey: process.env.Google_Api,
//     });
//     console.log("reacb");
    
// const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [
//         {
//       role:"user",
//       parts:[
//         {
//             text:`
// Identify the food in this image and describe it in one short simple sentence.

// Rules:
// - Do NOT return JSON
// - Do NOT return array
// - Just return a plain sentence

// Example:
// "boiled eggs with parsley"  only give food details not like foods on the table onlt ehat foods the image have return that.
//               `
//         },
//         {
//             inlineData:{
//                 mimeType: "image/jpeg", // ⚠️ important
//                 data: image_b64,
//             }
//         }
//       ]
//         }
//     ]
//   });
// // const response = await ai.models.list();
//   console.log("res");
  
// //   console.log(response.text);
// //   result = JSON.parse(response.text);
//   const description = response.text.trim().toLowerCase();
//   console.log("AI Description:", description);

//   return description;
// }catch(error){
//     console.log(error);
    
// throw new ApiError(302,"error at geminai")
// }
// }
