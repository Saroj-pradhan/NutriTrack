import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Decode JWT payload (no library needed) ───────────────────────────────────
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ── Stat pill ────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, color = "#00e676" }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4 gap-1"
    >
      <p className="text-xl font-black" style={{ color }}>
        {value ?? "—"}
        {value && <span className="text-sm font-semibold ml-0.5 text-neutral-400">{unit}</span>}
      </p>
      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-neutral-800/60 last:border-0">
      <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-sm text-white font-semibold capitalize">{value ?? "—"}</span>
    </div>
  );
}

// ── Macro progress bar ───────────────────────────────────────────────────────
function MacroBar({ label, value, max, color }) {
  const pct = max ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-neutral-400">{label}</span>
        <span className="font-semibold" style={{ color }}>{value ?? 0} g</span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-black flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #00e676 0%, #00c853 100%)",
        boxShadow: "0 0 32px rgba(0,230,118,0.35)",
      }}
    >
      {initials}
    </div>
  );
}

// ── Goal badge ───────────────────────────────────────────────────────────────
const GOAL_META = {
  lose_weight:     { label: "Lose Weight",     icon: "🔥", color: "#f97316" },
  gain_weight:     { label: "Gain Weight",     icon: "💪", color: "#60a5fa" },
  maintain_weight: { label: "Maintain Weight", icon: "⚖️", color: "#a78bfa" },
  track_only:      { label: "Track Only",      icon: "📊", color: "#00e676" },
};

function GoalBadge({ goal }) {
  const meta = GOAL_META[goal] || { label: goal, icon: "🎯", color: "#00e676" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{ color: meta.color, borderColor: meta.color + "40", background: meta.color + "12" }}
    >
      {meta.icon} {meta.label}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PROFILE COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pull user data from localStorage (stored during login)
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // fallback: decode token for minimal info
        const decoded = decodeToken(token);
        if (decoded) setUser(decoded);
      }
    } else {
      // fallback: decode token
      const decoded = decodeToken(token);
      if (decoded) setUser(decoded);
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedEmail");
    navigate("/login");
  };

  // ── BMI calculation ──────────────────────────────────────────────────────
  const bmi = user?.height && user?.weight
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
    : null;

  const bmiLabel = bmi
    ? bmi < 18.5 ? "Underweight"
    : bmi < 25   ? "Normal"
    : bmi < 30   ? "Overweight"
    : "Obese"
    : null;

  const bmiColor = bmi
    ? bmi < 18.5 ? "#60a5fa"
    : bmi < 25   ? "#00e676"
    : bmi < 30   ? "#f59e0b"
    : "#f97316"
    : "#00e676";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-500">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24 sm:pb-10">
      {/* Top glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(0,230,118,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-8 flex flex-col gap-5">

        {/* ── Profile header card ── */}
        <div
          className="rounded-3xl border border-neutral-800 p-6 flex flex-col gap-5"
          style={{ background: "rgba(13,13,13,0.95)" }}
        >
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white truncate">{user.name || "User"}</h1>
              <p className="text-neutral-500 text-sm truncate">{user.email}</p>
              <div className="mt-2">
                {user.goal && <GoalBadge goal={user.goal} />}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Weight" value={user.weight} unit="kg" color="#00e676" />
            <StatCard label="Height" value={user.height} unit="cm" color="#60a5fa" />
            <StatCard label="Age"    value={user.age}    unit="yr" color="#a78bfa" />
          </div>

          {/* BMI */}
          {bmi && (
            <div
              className="rounded-2xl border px-5 py-4 flex items-center justify-between"
              style={{ borderColor: bmiColor + "30", background: bmiColor + "08" }}
            >
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium mb-0.5">BMI</p>
                <p className="text-2xl font-black" style={{ color: bmiColor }}>{bmi}</p>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: bmiColor, borderColor: bmiColor + "40", background: bmiColor + "15" }}
              >
                {bmiLabel}
              </span>
            </div>
          )}
        </div>

        {/* ── Calorie goal card ── */}
        {user.dailyCalorieGoal > 0 && (
          <div
            className="rounded-3xl border border-neutral-800 p-6"
            style={{ background: "rgba(13,13,13,0.95)" }}
          >
            <p className="text-xs text-green-500 uppercase tracking-widest font-semibold mb-4">Daily Target</p>
            <div className="text-center mb-4">
              <p className="text-5xl font-black text-green-400">{user.dailyCalorieGoal?.toLocaleString()}</p>
              <p className="text-neutral-500 text-sm mt-1">kcal / day</p>
            </div>

            {/* Estimated macros (40/30/30 split as reference) */}
            <div className="flex flex-col gap-3">
              <MacroBar label="Protein (30%)" value={Math.round((user.dailyCalorieGoal * 0.30) / 4)}  max={250} color="#00e676" />
              <MacroBar label="Carbs (40%)"   value={Math.round((user.dailyCalorieGoal * 0.40) / 4)}  max={350} color="#60a5fa" />
              <MacroBar label="Fats (30%)"    value={Math.round((user.dailyCalorieGoal * 0.30) / 9)}  max={100} color="#f59e0b" />
            </div>
          </div>
        )}

        {/* ── Personal info card ── */}
        <div
          className="rounded-3xl border border-neutral-800 p-6"
          style={{ background: "rgba(13,13,13,0.95)" }}
        >
          <p className="text-xs text-green-500 uppercase tracking-widest font-semibold mb-2">Personal Info</p>
          <InfoRow label="Gender"         value={user.gender} />
          <InfoRow label="Activity Level" value={user.activityLevel?.replace("_", " ")} />
          <InfoRow label="Target Weight"  value={user.targetWeight ? `${user.targetWeight} kg` : null} />
          <InfoRow label="Goal"           value={user.goal?.replace(/_/g, " ")} />
        </div>

        {/* ── Logout button ── */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/5
                     hover:bg-red-500/10 hover:border-red-500/50 text-red-400 font-semibold
                     py-3.5 rounded-2xl text-sm transition-all duration-200 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>

        <p className="text-center text-neutral-700 text-xs pb-2">Every calorie is data. Track it.</p>
      </div>
    </div>
  );
}