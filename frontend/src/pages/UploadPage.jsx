// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";
// import { toast } from "react-toastify";
// import CircularProgress from "../components/CircularProgress";
// import AppNavBar from "../components/AppNavBar";
// import { RiCameraAiFill } from "react-icons/ri";
// import { GiElectric } from "react-icons/gi";
// import { FaHeadSideVirus } from "react-icons/fa";
// import RecentQuery from "../components/RecentQuery";
// function UploadPage() {
//   const navigate = useNavigate();
//   const [Imgs, setImgs] = useState(null);
//   const [base64Img, setBase64Img] = useState("");
//   const [loading, setloading] = useState(false);
//   let file = null;
//   function handleChange(e) {
//     console.log(e.target);
//     file = e.target.files[0];
//     setImgs(URL.createObjectURL(e.target.files[0]));
//     localStorage.setItem(
//       "FoodImage",
//       `${URL.createObjectURL(e.target.files[0])}`,
//     );
//     const filereader = new FileReader();
//     filereader.onloadend = () => {
//       const base64 = filereader.result.split(",")[1];
//       setBase64Img(base64);
//     };
//     filereader.readAsDataURL(file);
//   }
//   async function handelSubmittion() {
//     if(!Imgs) {
//       toast.error("select img first");
//       return;
//     }
//     try {
//       setloading(true);
//       const data = await axios.post(`${import.meta.env.VITE_BACKEND_API}api/`, {
//         image_b64: base64Img,
//       });
//       console.log(data);
//       setloading(false);
//       let Info = data?.data?.description;
//       if (Info.status == 422 || Info.status == 400) {
//         toast.error(`${Info.message}`);
//         setloading(false);
//         return;
//       }
//       let NutritionData = Info.items;
//       console.log(NutritionData, "dattatataaa");

//       localStorage.setItem("NutritionData", JSON.stringify(NutritionData));
//       navigate("/result");
//       console.log("After navigate");
//     } catch (error) {
//       console.log(error, "err");
//       setloading(false);
//       toast.error("server error");
//     }
//   }
//   if (loading) return <Loader img={`${Imgs}`} />;
//   return (
//     <div className="w-[100%]  min-h-[92vh] bg-[#171A1F] flex  justify-center p-4 ">
//     <div className="flex flex-col w-full max-w-2xl relative max-[640px]:text-center ">
//       <p className="text-green-400 mb-4">Precision Health AI</p>
//       <p className="text-5xl black font-bold mb-4 text-white">Fuel your <span className="text-green-400">potential.</span></p>
//       <p className="text-xl  pl-2 pr-2 mb-8 text-white">
//         Every calorie is data. Transform your nutritional intake into actionable biological insights with a single snap.
//       </p>
//       <div className="flex flex-col sm:flex-row w-100% h-[730px] sm:h-70 gap-3">
//         <div className="h-[40%] sm:h-[100%] w-[100%] sm:w-[60%] rounded-xl bg-[#2a2b2d] flex flex-col items-center group">
        
//            <label className="mt-4 h-40 w-[80%] rounded-2xl relative overflow-hidden ">
//              <div className="z-29 absolute left-0 top-[20%] h-full w-[100%] bg-transparent flex flex-col items-center">
//               <div className="bg-green-400 px-2 py-2 rounded-full w-fit">
//                 < RiCameraAiFill size={40} />
//               </div>
              
//               <p className="text-md text-white font-bold">Snap your meal to track instantly.</p>
//               <p className="text-xs text-gray-300">Drag and drop or click to upload</p>
//              </div>
//               <div className="absolute left-0 top-5 bg-gray-500 h-full w-[100%] blur-[120px] hover:blur-[130px] ">
              
//              </div>
//              {Imgs ? <img src={Imgs} className="h-full w-[100%] rounded-2xl transition-transform ease-in-out duration-300 group-hover:scale-110" />: <img className=" h-full w-[100%] rounded-2xl transition-transform ease-in-out duration-300 group-hover:scale-110" src="/foods.png" alt="food text" />} 
          
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleChange}
//           className="hidden"
//         />
//       </label>
//     {/* {Imgs && <img src={Imgs} className="mt-4 w-40" />} */}
//     {/* <img className="mt-4 h-40 w-[80%]" src="https://res.cloudinary.com/dddmddgzs/image/upload/v1767606273/WhatsApp_Image_2026-01-03_at_6.44.45_PM_dzaeh9.jpg" alt="" srcset="" /> */}
//   <div className="sm:flex gap-10 sm:items-center">
// {(
//         <button
//           disabled={!Imgs}
//           onClick={handelSubmittion}

//           className="inline-flex items-center justify-center bg-green-400 text-black px-3 py-4 sm:px-2 sm:py-1 rounded-2xl w-[250px] sm:w-[120px] h-11 font-semibold mt-5"
//         >
//           Analyze now
//         </button>
//       )}
//       <p className="text-sm text-gray-400 uppercase sm:text-[0.6rem] pt-4 ">Supported formats: JPG, PNG, HEIC</p>
//       </div>
//         </div>
//         <div className="h-[60%] sm:h-[100%] w-[100%] sm:w-[40%] rounded-xl  flex flex-col  gap-3  ">
//           <div className="h-[50%] sm:h-[50%] rounded-xl w-[100%] bg-[#2a2b2d] p-8 sm:p-3 flex flex-col justify-between ">
//                   <div className="flex justify-between items-start">
//                     <div className="bg-[#78f065] rounded-full w-fit ">
//                      <GiElectric  size={25}/>
//                    </div>
//                    <p className="text-[#78f065] bg-green-900 px-1.5 font-semibold py-0.5 rounded-full">Live Tracking</p>
//                   </div>
//                   <div>
//  <p className="text-3xl font-bold text-start text-white mb-1">1844</p>
//  <p className="text-xs font-semibold text-gray-400 text-start">KCAL REMAINING</p>
//                   </div>
          
//           </div>
//           <div className="h-[50%] sm:h-[50%] rounded-xl w-[100%] bg-[#2a2b2d] p-8 sm:p-3 flex flex-col justify-between">
//  <div className="flex justify-between items-start">
//                     <div className="bg-[#55eaea] rounded-full w-fit px-2 py-2 ">
//                      <FaHeadSideVirus   size={25}/>
//                    </div>
//                    {/* <p className="text-[#62f6f8] bg-green-900 px-1.5 font-semibold py-0.5 rounded-full">Active</p> */}
//                   </div>
//                   <div>
//  {/* <p className="text-3xl font-bold text-start text-white mb-1">1844</p> */}
//  <p className="text-xs font-semibold text-gray-400 text-start">AI Engine Status</p>
//  <p className="text-xs font-semibold text-green-400 text-start"><span className=" inline-block bg-green-500 h-2 w-2 rounded-full "></span>  Neural Core Active</p>
//                   </div>
          
//           </div>
//         </div>
//       </div>

//      <RecentQuery/>
      
      
    
//     </div>
//     </div>
//   );
// }

// export default UploadPage;

import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiCameraAiFill } from "react-icons/ri";
import { GiElectric } from "react-icons/gi";
import { MdOutlineFoodBank } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const getMimeType = (file) => file?.type || "image/jpeg";

function calcNutrient(per100, qty) {
  return Math.round(((per100 * qty) / 100) * 10) / 10;
}

// ─── Nutrition Result Card ────────────────────────────────────────────────────
function NutritionCard({ item, index, onQtyChange, qty }) {
  const isLiquid = item.serving_unit === "ml";
  const unit = isLiquid ? "ml" : "g";
  const label = isLiquid ? "millilitres" : "grams";
  const icon = isLiquid ? "🥛" : "🍽️";
const [saving, setSaving] = useState(false);
  const actualCals = calcNutrient(item.calories, qty);
  const actualProt = calcNutrient(item.protein, qty);
  const actualCarbs = calcNutrient(item.carbs, qty);
  const actualFat = calcNutrient(item.fat, qty);

  return (
    <div
      className="rounded-2xl bg-[#1c1f1f] border border-[#2d2d2d] overflow-hidden"
      style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-white font-bold text-base">{item.name}</p>
          <p className="text-gray-500 text-xs">per 100{unit}</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-black text-xl tabular-nums">{actualCals}</p>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">kcal</p>
        </div>
      </div>

      {/* Macro row */}
      <div className="flex gap-2 px-4 pb-3">
        {[
          { label: "Protein", value: actualProt, color: "#4ade80" },
          { label: "Carbs",   value: actualCarbs, color: "#60a5fa" },
          { label: "Fats",    value: actualFat,   color: "#f97316" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex-1 bg-[#111] rounded-xl py-2 text-center">
            <p className="font-bold text-sm tabular-nums" style={{ color }}>{value}g</p>
            <p className="text-gray-600 text-[10px] uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Quantity slider */}
      <div className="px-4 pb-4 border-t border-[#232323] pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs">How much did you eat?</span>
          <div className="flex items-center gap-1 bg-[#111] rounded-lg px-2 py-1">
            <input
              type="number"
              min="10"
              max="2000"
              value={qty}
              onChange={(e) => onQtyChange(index, Number(e.target.value))}
              className="w-14 bg-transparent text-green-400 font-bold text-sm text-right outline-none tabular-nums"
            />
            <span className="text-gray-500 text-xs">{unit}</span>
          </div>
        </div>
        <input
          type="range"
          min="10"
          max={isLiquid ? 2000 : 1000}
          step="10"
          value={qty}
          onChange={(e) => onQtyChange(index, Number(e.target.value))}
          className="w-full accent-green-400 h-1.5"
        />
        <div className="flex justify-between mt-1">
          <span className="text-gray-600 text-[10px]">10{unit}</span>
          <span className="text-gray-400 text-xs font-medium">{qty} {label}</span>
          <span className="text-gray-600 text-[10px]">{isLiquid ? "2000ml" : "1000g"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Upload Page ─────────────────────────────────────────────────────────
export default function UploadPage() {
  const navigate = useNavigate();
  const inputRef  = useRef(null);
const [saving, setSaving] = useState(false);
  const [mode, setMode]           = useState("image"); // "image" | "text"
  const [imgPreview, setImgPreview] = useState(null);
  const [base64Img, setBase64Img]   = useState("");
  const [mimeType, setMimeType]     = useState("image/jpeg");
  const [textInput, setTextInput]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [results, setResults]       = useState(null);   // array of items from Gemini
  const [quantities, setQuantities] = useState([]);     // per-item qty state
  const [dragOver, setDragOver]     = useState(false);
  const [errorMsg, setErrorMsg]     = useState(null);

  // ── File handling ────────────────────────────────────────────────────────
  async function processFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setImgPreview(URL.createObjectURL(file));
    setMimeType(getMimeType(file));
    const b64 = await toBase64(file);
    setBase64Img(b64);
    setResults(null);
    setErrorMsg(null);
  }

  function handleFileInput(e) {
    processFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function clearImage() {
    setImgPreview(null);
    setBase64Img("");
    setResults(null);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  // ── Quantity helpers ─────────────────────────────────────────────────────
  function handleQtyChange(index, val) {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = Math.max(10, val);
      return next;
    });
  }

  // ── Analyze image ────────────────────────────────────────────────────────
  async function analyzeImage() {
    if (!base64Img) { toast.error("Upload an image first"); return; }
    setLoading(true);
    setResults(null);
    setErrorMsg(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}api/`,
        { image_b64: base64Img, mime_type: mimeType }
      );

      if (data.status === 422 || data.status === 400) {
        setErrorMsg(data.message);
        return;
      }

      const items = data.items ?? [];
      setResults(items);
      setQuantities(items.map((it) => (it.serving_unit === "ml" ? 250 : 100)));
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Text mode: call a text-based endpoint or reuse image endpoint ────────
  async function analyzeText() {
    if (!textInput.trim()) { toast.error("Describe your meal first"); return; }
    setLoading(true);
    setResults(null);
    setErrorMsg(null);

    try {
      // reuse same endpoint — send text as a prompt image substitute
      // You may want a separate /api/nutrition/text endpoint on backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}api/analyze-text`,
        { description: textInput.trim() },
      );

      if (data.status === 400 || data.status === 422) {
        setErrorMsg(data.message);
        return;
      }

      const items = data.items ?? [];
      setResults(items);
      setQuantities(items.map((it) => (it.serving_unit === "ml" ? 250 : 100)));
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Save to meal log ─────────────────────────────────────────────────────
  // function saveToLog() {
  //   if (!results) return;
  //   const finalItems = results.map((item, i) => ({
  //     name:     item.name,
  //     calories: calcNutrient(item.calories, quantities[i]),
  //     protein:  calcNutrient(item.protein,  quantities[i]),
  //     carbs:    calcNutrient(item.carbs,    quantities[i]),
  //     fat:      calcNutrient(item.fat,      quantities[i]),
  //     imageUrl: imgPreview || null,
  //   }));
  //   localStorage.setItem("NutritionData", JSON.stringify(finalItems));
  //   navigate("/result");
  // }
async function saveToLog() {
  console.log("hii1")
  if (!results || results.length === 0) return;

  const today = (() => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-"); // local date, never toISOString()
  })();

  const finalItems = results.map((item, i) => ({
    name:     item.name,
    calories: calcNutrient(item.calories, quantities[i]),
    protein:  calcNutrient(item.protein,  quantities[i]),
    carbs:    calcNutrient(item.carbs,    quantities[i]),
    fat:      calcNutrient(item.fat,      quantities[i]),
    imageUrl: imgPreview || null,
  }));

  try {
    setSaving(true); // add: const [saving, setSaving] = useState(false);

   const datas =  await axios.post(
      `${import.meta.env.VITE_BACKEND_API}meals/addmeal`,
      {
        name: "My Meal",   // or let user pick: Breakfast / Lunch / Dinner / Snack
        date: today,
        items: finalItems,
      },
      {
       headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`
       }
      },
      console.log("hii1")
    );
  console.log(datas);
    toast.success("Meal added to your log!");
    navigate("/log");        // go back to dashboard to see updated totals

  } catch (err) {
    console.dir(err);
    toast.error("Failed to save meal. Please try again.");
  } finally {
    setSaving(false);
  }
}

  const totalCals = results
    ? results.reduce((sum, it, i) => sum + calcNutrient(it.calories, quantities[i]), 0)
    : 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
        .drag-active { border-color: #4ade80 !important; background: #0d1f0d; }
        input[type=range]::-webkit-slider-thumb { cursor: pointer; }
      `}</style>

      <div className="w-full min-h-[92vh] bg-[#171A1F] flex justify-center p-4">
        <div className="flex flex-col w-full max-w-2xl mx-auto gap-5">

          {/* ── Hero text ────────────────────────────────────────────────── */}
          <div className="mt-2" style={{ animation: "fadeUp 0.4s ease both" }}>
            <p className="text-green-400 text-xs uppercase tracking-widest font-semibold mb-1">
              Precision Health AI
            </p>
            <h1 className="text-4xl font-black text-white leading-tight">
              Fuel your <span className="text-green-400">potential.</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Snap a meal or describe what you ate — our AI breaks down every macro instantly.
            </p>
          </div>

          {/* ── Mode toggle ──────────────────────────────────────────────── */}
          <div
            className="flex bg-[#1c1f1f] rounded-2xl p-1 w-fit gap-1"
            style={{ animation: "fadeUp 0.4s ease 0.1s both" }}
          >
            {[
              { id: "image", label: "📷  Scan Image" },
              { id: "text",  label: "✏️  Type Meal"  },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { setMode(id); setResults(null); setErrorMsg(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === id
                    ? "bg-green-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── IMAGE MODE ───────────────────────────────────────────────── */}
          {mode === "image" && (
            <div
              className={`relative rounded-2xl border-2 border-dashed border-[#2d2d2d] bg-[#1c1f1f] transition-all duration-200 overflow-hidden ${dragOver ? "drag-active" : ""}`}
              style={{ animation: "fadeUp 0.4s ease 0.15s both" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {imgPreview ? (
                /* Image preview */
                <div className="relative">
                  <img
                    src={imgPreview}
                    alt="Uploaded food"
                    className="w-full h-64 object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f1f] via-transparent to-transparent" />
                  {/* Clear button */}
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 text-white bg-black/60 rounded-full p-0.5 hover:bg-red-500 transition-colors"
                  >
                    <IoCloseCircle size={26} />
                  </button>
                  {/* Analyze button over image */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center mb-6">
                    <button
                      onClick={analyzeImage}
                      disabled={loading}
                      className="bg-green-400 hover:bg-green-300 text-black font-bold px-8 py-3 rounded-2xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-400/20"
                    >
                      {loading ? "Analyzing…" : "⚡ Analyze Now"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <label className="flex flex-col items-center justify-center h-52 cursor-pointer gap-3">
                  <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-2xl">
                    <RiCameraAiFill size={36} className="text-green-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Drop your meal photo here</p>
                    <p className="text-gray-500 text-xs mt-1">or click to browse · JPG, PNG, HEIC</p>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              )}

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 bg-[#171A1F]/80 flex flex-col items-center justify-center gap-3 z-10">
                  <div
                    className="w-12 h-12 rounded-full border-4 border-green-400/20 border-t-green-400"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                  <p className="text-green-400 text-sm font-semibold">AI is reading your meal…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}
            </div>
          )}

          {/* ── TEXT MODE ────────────────────────────────────────────────── */}
          {mode === "text" && (
            <div style={{ animation: "fadeUp 0.4s ease 0.15s both" }}>
              <div className="rounded-2xl bg-[#1c1f1f] border border-[#2d2d2d] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdOutlineFoodBank size={20} className="text-green-400" />
                  <span className="text-gray-400 text-sm">Describe your meal</span>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. 2 boiled eggs, a bowl of oats with 250ml milk, and a banana…"
                  rows={4}
                  className="w-full bg-[#111] text-white text-sm rounded-xl p-3 outline-none border border-[#2a2a2a] focus:border-green-400/50 resize-none placeholder-gray-600 transition-colors"
                />
                <button
                  onClick={analyzeText}
                  disabled={loading || !textInput.trim()}
                  className="mt-3 w-full bg-green-400 hover:bg-green-300 text-black font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing…" : "⚡ Analyze Meal"}
                </button>
              </div>
            </div>
          )}

          {/* ── Error state (not food / unclear) ─────────────────────────── */}
          {errorMsg && (
            <div
              className="rounded-2xl bg-red-950/40 border border-red-800/40 p-5 flex items-start gap-4"
              style={{ animation: "fadeUp 0.3s ease both" }}
            >
              <span className="text-3xl">🚫</span>
              <div>
                <p className="text-red-400 font-bold text-sm">Couldn't analyze this</p>
                <p className="text-red-300/70 text-sm mt-1">{errorMsg}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Try a clearer photo, or switch to text mode to describe your meal manually.
                </p>
              </div>
            </div>
          )}

          {/* ── Results ──────────────────────────────────────────────────── */}
          {results && results.length > 0 && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              {/* Summary header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-lg">
                    {results.length} item{results.length !== 1 ? "s" : ""} detected
                  </p>
                  <p className="text-gray-500 text-xs">Adjust quantities to match what you ate</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-black text-2xl tabular-nums">{totalCals}</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">total kcal</p>
                </div>
              </div>

              {/* Item cards */}
              <div className="space-y-3">
                {results.map((item, i) => (
                  <NutritionCard
                    key={i}
                    item={item}
                    index={i}
                    qty={quantities[i] ?? 100}
                    onQtyChange={handleQtyChange}
                  />
                ))}
              </div>

              {/* Save button */}
             <button
  onClick={saveToLog}
  disabled={saving}
  className="mt-4 w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-green-400/20"
>
  {saving ? "Saving…" : "✓ Add to Today's Log"}
</button>
            </div>
          )}

          {/* ── Status widgets ────────────────────────────────────────────── */}
          {!results && (
            <div
              className="grid grid-cols-2 gap-3"
              style={{ animation: "fadeUp 0.4s ease 0.25s both" }}
            >
              <div className="rounded-2xl bg-[#1c1f1f] border border-[#2d2d2d] p-4 flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <div className="bg-green-400/10 p-1.5 rounded-full">
                    <GiElectric size={18} className="text-green-400" />
                  </div>
                  <span className="text-green-400 bg-green-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">1844</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">kcal remaining</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#1c1f1f] border border-[#2d2d2d] p-4 flex flex-col justify-between h-28">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-green-500"
                    style={{ animation: "pulse-ring 2s ease infinite" }}
                  />
                  <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider">
                    Neural Core Active
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">AI Engine</p>
                  <p className="text-gray-500 text-xs">Ready to analyze</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}