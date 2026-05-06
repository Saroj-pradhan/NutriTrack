// import { useEffect, useState , useRef } from "react";   
// import { toast } from "react-toastify";
// import RecentQuery from "./RecentQuery";
// import CircularProgress from "./CircularProgress";
// function Content(){
//   const dayRefs = useRef({});
//   const [selectedDate,setselectedDate] = useState(new Date().toISOString().split("T")[0]);
//   //  const [dummyDate,setdummyDate] = useState(new Date().toISOString().split("T")[0]);
//    const dummyDate = getdummyDates();
//   const [Dates,setDates] = useState([new Date().toISOString().split("T")[0]]);
//   useEffect(()=>{
// getNDays(16);
//   },[])
//   useEffect(() => {
//   if (dayRefs.current[selectedDate]) {
//     dayRefs.current[selectedDate].scrollIntoView({
//       behavior: "smooth",
//       inline: "center", // 🔥 important (center it nicely)
//       block: "nearest",
//     });
//   }
// }, [Dates , selectedDate]);
//   function getNDays(n){
//     const NDates = [];
//     let currentDay = new Date();
//    for(let i=0;i<n;i++){ 
    
//        let newDate = new Date();
//        console.log(newDate,"newDt");
       
// newDate.setDate(newDate.getDate()-i);
// console.log(newDate,"chnage");

//  NDates.push(newDate.toISOString().split("T")[0]);
//     }
//     setDates([...NDates.reverse()]);
//     console.log("dddddddddddtttttttttt");
//   console.log(Dates);
//   console.log(selectedDate)
//   }
//   function getdummyDates(){
//     let arr = [];
    
//     for(let i =1;i<=2;i++){
//       let dt = new Date();
//        dt.setDate(dt.getDate() + i);
// arr.push(dt.toISOString().split("T")[0])
//     }
//     return arr;
//   }
//    function handelDateChanges(dt){
//     setselectedDate(dt);
//    }
//    const getDay = (date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  
//   return (
//     <div className="w-[100%] min-h-[92vh] bg-[#171A1F] flex  justify-center p-4 ">
//     <div className="flex flex-col w-full  max-w-2xl relative overflow-hidden mx-auto  ">
//       <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar mt-2 mb-5 snap-x snap-mandatory scroll-smooth">
//        { Dates.map((dt)=> (
//          <div className={`flex flex-col items-center justify-center ${selectedDate == dt ?"bg-green-400 h-20 min-w-[50px]":"bg-[#343838] text-white h-16 min-w-[48px]"} rounded-2xl   p-2 flex-shrink-0 snap-center`}
//          onClick={()=>handelDateChanges(dt)}
//          ref={(el) => (dayRefs.current[dt] = el)}
//          >
//           <p>{getDay(dt)}</p>
//           <p>{dt.split("-")[2]}</p>
//         </div>
//         ))}
              
//               { dummyDate.map((dt)=> (
//          <div className={`flex flex-col items-center justify-center ${selectedDate == dt ?"bg-green-400 h-20 min-w-[50px]":"bg-[#6e6e6e] text-white h-16 min-w-[48px]"} rounded-2xl   p-2 flex-shrink-0 snap-center`}
         
//          >
//           <p>{getDay(dt)}</p>
//           <p>{dt.split("-")[2]}</p>
//         </div>
//         ))}
//       </div>
      
//       <div className="bg-[#252a2a] max-[480px]: max-[480px]:h-102 h-54 rounded-xl w-[100%] flex max-[480px]:flex-col p-2 max-[480px]:justify-center ">
//         <div className=" max-[480px]:h-[50%] max-[480px]:w-[100%] h-[100%] w-[40%] flex justify-center items-center text-white">
//            <CircularProgress percent = {90} />
//         </div>
//         <div className=" max-[480px]:h-[50%] max-[480px]:w-[100%] h-[100%] w-[60%] sm:pl-5 pl-5 p-2 mb-4 ">
//           <div>
//             <p className="text-xl uppercase text-gray-200 font-semibold">Daily Summary</p>
//             <p className="text-2xl text-gray-400 font-bold"><span className="text-6xl text-green-400">1840</span> / 2200</p>
//           </div>
//           <div className="flex mt-5 gap-5 sm:gap-6">
//                 <div className="flex flex-col items-center gap-2 bg-black rounded-2xl  w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2  justify-start">
//                   <span className="text-gray-400 uppercase ">Protein </span>
//                   <p className="text-white font-bold">142g</p>
//                 </div>
//                  <div className="flex flex-col items-center gap-2 bg-black rounded-2xl w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2  justify-start">
//                   <span className="text-gray-400 uppercase ">CARBS </span>
//                   <p className="text-white font-bold">142g</p>
//                 </div>
//                  <div className="flex flex-col items-center gap-2 bg-black rounded-2xl w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2 justify-start">
//                   <span className="text-gray-400 uppercase ">fatS </span>
//                   <p className="text-white font-bold">142g</p>
//                 </div>
//           </div>
//         </div>
//       </div>
// <RecentQuery/>
//     </div>
//     </div>
//   );
// }

// export default Content;





















import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import RecentQuery from "./RecentQuery";
import CircularProgress from "./CircularProgress";
import History from "./History";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const toDateKey = (date) => new Date(date).toISOString().split("T")[0];
const today = toDateKey(new Date());

function getDay(dateStr) {
  // Add T00:00 so it parses in local time, not UTC (avoids off-by-one day)
  return new Date(`${dateStr}T00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

function buildLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toDateKey(d));
  }
  return days;
}

function buildFuture2Days() {
  const days = [];
  for (let i = 1; i <= 2; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(toDateKey(d));
  }
  return days;
}

const EMPTY_DAY = { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, items: [] };
const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 65 };

// ─── Component ────────────────────────────────────────────────────────────────
export default function Content() {
  const dayRefs = useRef({});

  const [selectedDate, setSelectedDate] = useState(today);
  const [monthlyCache, setMonthlyCache] = useState(null); // { data: {}, goals: {} }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pastDays = buildLast30Days();
  const futureDays = buildFuture2Days();

  // ── Fetch monthly data once on mount ────────────────────────────────────────
  const fetchMonthly = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}meals/monthly`, {
       headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`
       }// send JWT cookie — swap for headers if using Bearer
      });
      if (data.success) {
        setMonthlyCache({ data: data.data, goals: data.goals });
      }
    } catch (err) {
      console.error("Monthly fetch error:", err);
      setError("Failed to load meal data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthly();
  }, [fetchMonthly]);

  // ── Scroll selected date into view ──────────────────────────────────────────
  useEffect(() => {
    const el = dayRefs.current[selectedDate];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedDate, loading]);

  // ── Derive data for selected date — O(1) lookup, no API call ────────────────
  const dayData = monthlyCache?.data?.[selectedDate] ?? EMPTY_DAY;
  const goals   = monthlyCache?.goals ?? DEFAULT_GOALS;

  const { calories, protein, carbs, fat } = dayData.totals;
  const percent = goals.calories > 0
    ? Math.min(100, Math.round((calories / goals.calories) * 100))
    : 0;

  const isFuture = (dt) => dt > today;

  return (
    <div className="w-full min-h-[92vh] bg-[#171A1F] flex justify-center p-4">
      <div className="flex flex-col w-full max-w-2xl relative mx-auto">

        {/* ── Date Strip ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar mt-2 mb-5 snap-x snap-mandatory scroll-smooth">

          {pastDays.map((dt) => {
            const isSelected = selectedDate === dt;
            const hasData    = !!monthlyCache?.data?.[dt];
            return (
              <button
                key={dt}
                ref={(el) => (dayRefs.current[dt] = el)}
                onClick={() => setSelectedDate(dt)}
                className={[
                  "flex flex-col items-center justify-center rounded-2xl p-2 flex-shrink-0 snap-center transition-all duration-200 relative",
                  isSelected
                    ? "bg-green-400 h-20 min-w-[50px] text-black font-bold scale-105"
                    : "bg-[#343838] text-white h-16 min-w-[48px] hover:bg-[#3f4545]",
                ].join(" ")}
              >
                <p className="text-xs">{getDay(dt)}</p>
                <p className="text-sm font-semibold">{dt.split("-")[2]}</p>
                {/* Green dot if meals logged */}
                {hasData && !isSelected && (
                  <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}

          {/* Future dates — disabled, greyed out */}
          {futureDays.map((dt) => (
            <div
              key={dt}
              className="flex flex-col items-center justify-center bg-[#2a2a2a] text-[#555] h-16 min-w-[48px] rounded-2xl p-2 flex-shrink-0 snap-center cursor-not-allowed"
            >
              <p className="text-xs">{getDay(dt)}</p>
              <p className="text-sm">{dt.split("-")[2]}</p>
            </div>
          ))}
        </div>

        {/* ── Daily Summary Card ──────────────────────────────────────────── */}
        {loading ? (
          <SummaryCardSkeleton />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchMonthly} />
        ) : (
          <div className="bg-[#252a2a] rounded-xl w-full flex max-[480px]:flex-col p-3 max-[480px]:h-auto h-54 transition-all duration-300">

            {/* Circular progress */}
            <div className="max-[480px]:h-40 max-[480px]:w-full h-full w-[38%] flex justify-center items-center text-white">
              <CircularProgress percent={percent} />
            </div>

            {/* Numbers */}
            <div className="max-[480px]:w-full w-[62%] flex flex-col justify-center sm:pl-4 pl-3 p-2">
              <div>
                <p className="text-sm uppercase text-gray-400 font-semibold tracking-widest">
                  Daily Summary
                </p>
                <p className="text-gray-400 font-bold mt-1">
                  <span className="text-5xl text-green-400 font-black">{calories}</span>
                  <span className="text-xl ml-1">/ {goals.calories}</span>
                  <span className="text-sm ml-1 text-gray-500">kcal</span>
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      background: percent >= 100
                        ? "#ef4444"
                        : percent >= 75
                        ? "#f59e0b"
                        : "#4ade80",
                    }}
                  />
                </div>
              </div>

              {/* Macro pills */}
              <div className="flex mt-4 gap-2 flex-wrap">
                <MacroPill label="Protein" value={parseFloat(protein).toFixed(0)} goal={goals.protein} color="#4ade80" />
                <MacroPill label="Carbs"   value={parseFloat(carbs).toFixed(0)}   goal={goals.carbs}   color="#60a5fa" />
                <MacroPill label="Fats"    value={parseFloat(fat).toFixed(0)}     goal={goals.fat}     color="#f97316" />
              </div>
            </div>
          </div>
        )}

        {/* ── Pass selected date's items to RecentQuery ───────────────────── */}
        {/* <RecentQuery
          items={dayData.items}
          loading={loading}
          selectedDate={selectedDate}
          onMealAdded={fetchMonthly} // refresh cache after adding a meal
        /> */}
        {/* <History/> */}

        <div className="mt-6 space-y-3">
  {dayData.items.length === 0 ? (
    <div className="text-center text-gray-400">
      No meals logged for this day
    </div>
  ) : (
    dayData.items.map((item, idx) => (
      <div
        key={idx}
        className="flex items-center justify-between bg-[#252a2a] p-3 rounded-xl hover:bg-[#2f3535] transition"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* IMAGE / FALLBACK */}
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1f2937] flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt="food"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">
                {item.name?.toLowerCase().includes("egg")
                  ? "🥚"
                  : item.name?.toLowerCase().includes("milk")
                  ? "🥛"
                  : "🍽️"}
              </span>
            )}
          </div>

          {/* FOOD INFO */}
          <div>
            <p className="text-white font-semibold">
              {item.name}
            </p>
            <p className="text-gray-400 text-sm">
              P {item.protein}g • C {item.carbs}g • F {item.fat}g
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-green-400 font-semibold text-lg">
          {item.calories}
          <span className="text-sm text-gray-400 ml-1">cal</span>
        </div>
      </div>
    ))
  )}
</div>
      </div>
    </div>
  );
}

// ─── MacroPill ────────────────────────────────────────────────────────────────
function MacroPill({ label, value, goal, color }) {
  const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  return (
    <div className="flex flex-col bg-black rounded-xl pt-2 pb-2 px-3 min-w-[72px]">
      <span className="text-gray-400 text-[10px] uppercase tracking-wider">{label}</span>
      <p className="font-bold text-sm mt-0.5" style={{ color }}>{value}g</p>
      <div className="w-full h-0.5 bg-[#222] rounded-full mt-1.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SummaryCardSkeleton() {
  return (
    <div className="bg-[#252a2a] rounded-xl w-full h-54 flex p-3 gap-4 animate-pulse">
      <div className="w-[38%] flex justify-center items-center">
        <div className="w-32 h-32 rounded-full bg-[#333]" />
      </div>
      <div className="w-[62%] flex flex-col justify-center gap-3">
        <div className="h-3 w-24 bg-[#333] rounded" />
        <div className="h-10 w-36 bg-[#333] rounded" />
        <div className="h-1.5 w-full bg-[#333] rounded-full" />
        <div className="flex gap-2 mt-2">
          <div className="h-14 w-20 bg-[#333] rounded-xl" />
          <div className="h-14 w-20 bg-[#333] rounded-xl" />
          <div className="h-14 w-20 bg-[#333] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Error Card ───────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-[#252a2a] rounded-xl w-full h-40 flex flex-col items-center justify-center gap-3">
      <p className="text-red-400 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="text-green-400 text-sm border border-green-400 px-4 py-1.5 rounded-full hover:bg-green-400 hover:text-black transition-all"
      >
        Retry
      </button>
    </div>
  );
}