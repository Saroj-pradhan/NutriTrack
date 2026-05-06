import { useState } from "react";
import axios from "axios"
// ─── helpers ────────────────────────────────────────────────────────────────
const ACTIVITY_MAP = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };

function calcCalories({ gender, age, height, weight, goal, activityLevel }) {
  const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age);
  if (!w || !h || !a) return 0;
  let bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const tdee = Math.round(bmr * (ACTIVITY_MAP[activityLevel] || 1.2));
  let cal = tdee;
  if (goal === "lose_weight") cal = tdee - 500;
  else if (goal === "gain_weight") cal = tdee + 300;
  else if (goal === "maintain_weight") cal = tdee;
  else if (goal === "track_only") cal = 0;
  if (gender === "female" && cal < 1200) cal = 1200;
  if (gender === "male" && cal < 1500) cal = 1500;
  if (goal === "track_only") cal = 0;
  return cal;
}

// ─── sub-components ──────────────────────────────────────────────────────────
function InputField({ label, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600
                   focus:outline-none focus:border-green-500 transition-colors duration-200 w-full"
      />
    </div>
  );
}

function SelectField({ label, id, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white
                   focus:outline-none focus:border-green-500 transition-colors duration-200 w-full appearance-none"
      >
        {children}
      </select>
    </div>
  );
}

function PillSelector({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(({ label, val }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
            ${value === val
              ? "bg-green-500 border-green-500 text-black font-semibold"
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function GoalCard({ id, icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`rounded-2xl p-4 flex flex-col items-center gap-2 border transition-all duration-200
        ${selected
          ? "border-green-500 bg-green-500/10"
          : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-semibold text-center leading-tight ${selected ? "text-green-400" : "text-neutral-400"}`}>
        {label}
      </span>
    </button>
  );
}

function StepBar({ current, total }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300
            ${i < current - 1 ? "bg-green-700" : i === current - 1 ? "bg-green-500" : "bg-neutral-800"}`}
        />
      ))}
    </div>
  );
}

// ─── Step 1: Account Info ────────────────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  const [err, setErr] = useState("");

  const handleNext = () => {
    if (!data.name || !data.email || !data.password) {
      setErr("Please fill in all fields.");
      return;
    }
    if (data.password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    setErr("");
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-sm text-neutral-500">Fuel your potential — every calorie is data.</p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-green-500 tracking-widest uppercase">Account Info</p>
        <InputField
          label="Full Name" id="name" placeholder="Alex Johnson"
          value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))}
        />
        <InputField
          label="Email Address" id="email" type="email" placeholder="alex@email.com"
          value={data.email} onChange={e => setData(p => ({ ...p, email: e.target.value }))}
        />
        <InputField
          label="Password" id="password" type="password" placeholder="Min. 8 characters"
          value={data.password} onChange={e => setData(p => ({ ...p, password: e.target.value }))}
        />
      </div>

      {err && <p className="text-red-400 text-xs">{err}</p>}

      <button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors duration-200 text-sm">
        Continue →
      </button>

      <p className="text-center text-neutral-600 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-green-500 hover:text-green-400 transition-colors">Sign in</a>
      </p>
    </div>
  );
}

// ─── Step 2: Body Stats ──────────────────────────────────────────────────────
function Step2({ data, setData, onNext, onBack }) {
  const [err, setErr] = useState("");

  const handleNext = () => {
    if (!data.gender || !data.age || !data.height || !data.weight) {
      setErr("Please complete all fields.");
      return;
    }
    setErr("");
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Your body</h1>
        <p className="text-sm text-neutral-500">We'll calculate your personal calorie target.</p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-green-500 tracking-widest uppercase">Physical Stats</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-500 font-medium tracking-wide uppercase">Gender</label>
          <PillSelector
            options={[{ label: "Male", val: "male" }, { label: "Female", val: "female" }, { label: "Other", val: "other" }]}
            value={data.gender}
            onChange={v => setData(p => ({ ...p, gender: v }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Age (yrs)" id="age" type="number" placeholder="25"
            value={data.age} onChange={e => setData(p => ({ ...p, age: e.target.value }))}
          />
          <InputField
            label="Height (cm)" id="height" type="number" placeholder="170"
            value={data.height} onChange={e => setData(p => ({ ...p, height: e.target.value }))}
          />
        </div>

        <InputField
          label="Current Weight (kg)" id="weight" type="number" placeholder="70"
          value={data.weight} onChange={e => setData(p => ({ ...p, weight: e.target.value }))}
        />
      </div>

      {err && <p className="text-red-400 text-xs">{err}</p>}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-semibold py-3.5 rounded-xl border border-neutral-800 transition-colors text-sm">
          ← Back
        </button>
        <button onClick={handleNext} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors text-sm">
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Goals ───────────────────────────────────────────────────────────
const GOALS = [
  { id: "lose_weight", icon: "🔥", label: "Lose Weight" },
  { id: "gain_weight", icon: "💪", label: "Gain Weight" },
  { id: "maintain_weight", icon: "⚖️", label: "Maintain" },
  { id: "track_only", icon: "📊", label: "Track Only" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary (desk job, no exercise)" },
  { value: "light", label: "Light (1–3 days/week)" },
  { value: "moderate", label: "Moderate (3–5 days/week)" },
  { value: "active", label: "Active (6–7 days/week)" },
];

function Step3({ data, setData, onNext, onBack }) {
  const [err, setErr] = useState("");
  const showTarget = data.goal && data.goal !== "track_only";

  const handleNext = () => {
    if (!data.goal || !data.activityLevel) {
      setErr("Please select a goal and activity level.");
      return;
    }
    setErr("");
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Your goals</h1>
        <p className="text-sm text-neutral-500">Tell us what you're working toward.</p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-green-500 tracking-widest uppercase">Goal</p>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(g => (
            <GoalCard
              key={g.id} id={g.id} icon={g.icon} label={g.label}
              selected={data.goal === g.id}
              onClick={v => setData(p => ({ ...p, goal: v }))}
            />
          ))}
        </div>

        {showTarget && (
          <InputField
            label="Target Weight (kg)" id="targetWeight" type="number" placeholder="65"
            value={data.targetWeight} onChange={e => setData(p => ({ ...p, targetWeight: e.target.value }))}
          />
        )}

        <p className="text-xs font-semibold text-green-500 tracking-widest uppercase mt-1">Activity Level</p>
        <SelectField
          label="" id="activityLevel"
          value={data.activityLevel}
          onChange={e => setData(p => ({ ...p, activityLevel: e.target.value }))}
        >
          <option value="">Select activity level…</option>
          {ACTIVITY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </SelectField>
      </div>

      {err && <p className="text-red-400 text-xs">{err}</p>}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-semibold py-3.5 rounded-xl border border-neutral-800 transition-colors text-sm">
          ← Back
        </button>
        <button onClick={handleNext} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors text-sm">
          Calculate →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Review & Submit ─────────────────────────────────────────────────
function Step4({ data, onBack, onSubmit, loading, success }) {
  const cal = calcCalories(data);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">You're all set!</h2>
          <p className="text-sm text-neutral-500">Account created successfully.<br />Time to fuel your potential.</p>
        </div>
        <a href="/login" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors text-sm text-center block">
          Start Tracking →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Ready to go!</h1>
        <p className="text-sm text-neutral-500">Here's your personalized plan, {data.name.split(" ")[0]}.</p>
      </div>

      {/* Calorie badge */}
      <div className="rounded-2xl border border-green-900 bg-green-500/5 p-5 text-center">
        <p className="text-4xl font-bold text-green-400">
          {cal > 0 ? `${cal.toLocaleString()} kcal` : "Tracking mode"}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {cal > 0 ? "daily calorie goal based on your profile" : "Log meals without a calorie target"}
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Goal", data.goal.replace(/_/g, " ")],
          ["Weight", `${data.weight} kg`],
          ["Activity", data.activityLevel],
        ].map(([label, value]) => (
          <div key={label} className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
            <p className="text-neutral-500 text-xs mb-1">{label}</p>
            <p className="text-neutral-200 text-xs font-semibold capitalize leading-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-semibold py-3.5 rounded-xl border border-neutral-800 transition-colors text-sm">
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-black font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

// ─── Main SignupPage ─────────────────────────────────────────────────────────
const INITIAL_DATA = {
  name: "", email: "", password: "",
  age: "", gender: "", height: "", weight: "",
  goal: "", targetWeight: "", activityLevel: "",
};

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const TOTAL_STEPS = 4;

  const handleSubmit = async () => {
{console.log(data,"dataaaaa")}
    setLoading(true);
    setApiError("");
    try {
       const payload = {
      ...data,
      dailyCalorieGoal: calcCalories(data),
    };

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}user/signup`,
      payload
    );

    const result = res.data;
      if (result.success) {
        setSuccess(true);
      } else {
        setApiError(result.message || "Something went wrong.");
      }
    } catch(error) {
        console.log(error)
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,230,118,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-7 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="black" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-wide">NutriTrack</span>
          </div>

          {/* Step progress bar */}
          <StepBar current={success ? TOTAL_STEPS + 1 : step} total={TOTAL_STEPS} />

          {/* Step content */}
          {step === 1 && <Step1 data={data} setData={setData} onNext={() => setStep(2)} />}
          {step === 2 && <Step2 data={data} setData={setData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 data={data} setData={setData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && (
            <>
              <Step4 data={data} onBack={() => setStep(3)} onSubmit={handleSubmit} loading={loading} success={success} />
              {apiError && <p className="text-red-400 text-xs mt-3 text-center">{apiError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}