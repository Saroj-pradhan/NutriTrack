// const History = () => {
//   return (
//     <div className="flex flex-col mb-25 w-[100%] min-h-[92vh] bg-[#171A1F] p-4">
//             <div className="flex flex-col w-full  max-w-2xl relative overflow-hidden mx-auto  ">
//      <div className="flex justify-between mb-3 items-center pl-1 pr-1">
//   <p className=" text-2xl sm:text-3xl text-white font-semibold text-start mt-5">History</p>
//     {/* <p className="text-sm sm:text-lg text-green-400  text-start mt-5">View History <span className="text-green-500">➜</span></p>/ */}
//      </div>
//       <div className="bg-[#2a2b2d] flex justify-between p-2 rounded-sm">
//         <div className="flex gap-5 items-center">
//           <img
//             className="w-16 h-16 rounded-xl"
//             src="/foods.png"
//             alt="img"
//           />
//           <div>
//             <p className="text-white text-bold text-xl">Avocado Toast</p>
//             <p className="text-gray-400 text-md">12:45 pm Lunch</p>
//           </div>
//         </div>
//         <div className="flex flex-col items-center">
//           <p className="text-2xl text-green-400 font-bold">188</p>
//           <p className="text-gray-400 text-md">KCAL</p>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
import { useEffect, useState } from "react";
import axios from "axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(isoStr) {
  const d = new Date(isoStr);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, now)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatShortDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const GOAL = 2000; // replace with user goal from context/props if available

function CalorieBadge({ calories }) {
  const pct = Math.min(100, (calories / GOAL) * 100);
  const color =
    pct >= 100 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#4ade80";
  return (
    <span className="font-black text-lg tabular-nums" style={{ color }}>
      {calories}
      <span className="text-xs font-normal text-gray-500 ml-0.5">kcal</span>
    </span>
  );
}

// ─── Macro bar row ────────────────────────────────────────────────────────────
function MacroRow({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 w-12 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] text-gray-400 w-8 text-right tabular-nums">
        {value}g
      </span>
    </div>
  );
}

// ─── Single food item row ─────────────────────────────────────────────────────
function FoodItem({ item, index }) {
  const hasImage =
    item.imageUrl &&
    !item.imageUrl.includes("example.com");

  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b border-[#1e1e1e] last:border-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image or placeholder */}
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[#1e1e1e] flex items-center justify-center">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span className="text-lg">🍽️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.name}</p>
        <p className="text-gray-500 text-[11px] mt-0.5">
          P {item.protein}g · C {item.carbs}g · F {item.fat}g
        </p>
      </div>

      <span className="text-green-400 font-bold text-sm tabular-nums shrink-0">
        {item.calories}
        <span className="text-[10px] text-gray-500 font-normal ml-0.5">cal</span>
      </span>
    </div>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────
function DayCard({ entry, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const allItems = entry.meals.flatMap((m) => m.items);
  const pct = Math.min(100, Math.round((entry.totalCalories / GOAL) * 100));
  const ringColor =
    pct >= 100 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#4ade80";

  // SVG ring
  const r = 20, cx = 26, cy = 26, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1c1f1f] transition-all duration-300 hover:border-[#3a3a3a]"
      style={{
        animation: `fadeSlideIn 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* ── Header (always visible) ─────────────────────────────────────── */}
      <button
        className="w-full flex items-center gap-4 p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Mini ring */}
        <svg width="52" height="52" className="shrink-0 -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e1e" strokeWidth="4" />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
          {/* reset rotation for text */}
          <text
            x={cx} y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={ringColor}
            fontSize="9"
            fontWeight="700"
            transform={`rotate(90 ${cx} ${cy})`}
          >
            {pct}%
          </text>
        </svg>

        {/* Date + summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-white font-bold text-base">{formatDate(entry.date)}</p>
            <p className="text-gray-600 text-xs">{formatShortDate(entry.date)}</p>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            {allItems.length} item{allItems.length !== 1 ? "s" : ""} logged
          </p>

          {/* Macro mini bars */}
          <div className="mt-2 flex gap-3">
            {[
              { label: "P", value: entry.totalProtein,  color: "#4ade80" },
              { label: "C", value: entry.totalCarbs,    color: "#60a5fa" },
              { label: "F", value: entry.totalFat,      color: "#f97316" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
                <span className="text-[11px] text-gray-400 tabular-nums">{value}g</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie total + chevron */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <CalorieBadge calories={entry.totalCalories} />
          <span
            className="text-gray-600 text-xs transition-transform duration-300"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", display: "block" }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* ── Expanded items ──────────────────────────────────────────────── */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? `${allItems.length * 72 + 80}px` : "0px" }}
      >
        <div className="border-t border-[#232323] mx-4" />

        {/* Macro detail bars */}
        <div className="px-4 pt-3 pb-1 space-y-1.5">
          <MacroRow label="Protein" value={entry.totalProtein} max={150} color="#4ade80" />
          <MacroRow label="Carbs"   value={entry.totalCarbs}   max={250} color="#60a5fa" />
          <MacroRow label="Fats"    value={entry.totalFat}     max={65}  color="#f97316" />
        </div>

        {/* Food items */}
        <div className="px-4 pb-3 pt-1">
          {allItems.map((item, i) => (
            <FoodItem key={item._id ?? i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-[#1c1f1f] border border-[#2a2a2a] p-4 flex gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#2a2a2a] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-[#2a2a2a] rounded" />
            <div className="h-3 w-16 bg-[#2a2a2a] rounded" />
            <div className="h-2 w-full bg-[#2a2a2a] rounded" />
          </div>
          <div className="h-6 w-14 bg-[#2a2a2a] rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Main History Component ───────────────────────────────────────────────────
export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}meals/history`, 
          {
       headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`
       }// send JWT cookie — swap for headers if using Bearer
      }
        );
        if (data.success) setHistory(data.history);
      } catch (e) {
        console.error(e);
        setError("Could not load history. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full min-h-[92vh] bg-[#171A1F] flex justify-center p-4">
        <div className="flex flex-col w-full max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-6 mt-2">
            <h1 className="text-3xl font-black text-white tracking-tight">History</h1>
            <p className="text-gray-500 text-sm mt-1">Your nutrition log, day by day</p>
          </div>

          {loading && <Skeleton />}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-green-400 text-sm border border-green-400 px-4 py-1.5 rounded-full hover:bg-green-400 hover:text-black transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="text-5xl">🍽️</span>
              <p className="text-gray-400 font-medium">No meals logged yet</p>
              <p className="text-gray-600 text-sm">Start tracking to see your history here</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {history.map((entry, i) => (
                <DayCard key={entry.date} entry={entry} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
// };
// export default History;
