import { useState } from "react";
import axios from "axios";
// ─── Eye icon toggles ────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  );
}

// ─── Reusable input ──────────────────────────────────────────────────────────
function InputField({ label, id, type = "text", rightSlot, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-neutral-500 font-medium tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          {...props}
          className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white
                     placeholder-neutral-600 focus:outline-none focus:border-green-500
                     transition-colors duration-200 w-full pr-10"
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

// ─── Main LoginPage ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
  e?.preventDefault();
  setError("");
 
  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }
 
  setLoading(true);
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}user/login`, { email, password });
    const data = res.data;
 
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // ← save full user object
      if (remember) localStorage.setItem("rememberedEmail", email);
      setSuccess(true);
    } else {
      setError(data.message || "Invalid credentials.");
    }
  } catch (error) {
    if (error.response) {
      setError(error.response.data.message || "Something went wrong");
    } else {
      setError("Network error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};
 
//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Email and password are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//         console.log("hayyyyyy")
//       const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}user/login`,{ email, password });
//  console.log("hay");
//  console.log(res);
//       const data =  res.data;
//       console.log(data,"data")
//       if (data.success) {
//         // Store token — swap localStorage for your auth strategy if needed
//         localStorage.setItem("token", data.token);
//         if (remember) localStorage.setItem("rememberedEmail", email);
//         setSuccess(true);
//         // e.g. navigate("/dashboard");
//       } else {
//         setError(data.message || "Invalid credentials.");
//       }
//     } catch (error) {
//   console.dir(error, "error");

//   if (error.response) {
//     // backend responded with error
//     setError(error.response.data.message || "Something went wrong");
//   } else {
//     // network error
//     setError("Network error. Please try again.");
//   }
// }
//     finally {
//       setLoading(false);
//     }
//   };

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div
          className="pointer-events-none fixed inset-0"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,230,118,0.07) 0%, transparent 70%)" }}
        />
        <div className="relative bg-neutral-950 border border-neutral-800 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
            <p className="text-sm text-neutral-500">Login successful. Redirecting to your dashboard…</p>
          </div>
          <a
            href="/home"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors text-sm text-center block"
          >
            Go to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      {/* Radial glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,230,118,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-7 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-wide">NutriTrack</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-neutral-500">Sign in to continue tracking your goals.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <p className="text-xs font-semibold text-green-500 tracking-widest uppercase -mb-1">
              Credentials
            </p>

            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="alex@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <InputField
              label="Password"
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="text-neutral-500 hover:text-green-400 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPass} />
                </button>
              }
            />

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRemember(v => !v)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200
                    ${remember ? "bg-green-500 border-green-500" : "bg-neutral-900 border-neutral-700"}`}
                >
                  {remember && (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={3.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-neutral-500">Remember me</span>
              </label>
              {/* <a href="/forgot-password" className="text-xs text-green-500 hover:text-green-400 transition-colors">
                Forgot password?
              </a> */}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed
                         text-black font-bold py-3.5 rounded-xl transition-colors duration-200 text-sm mt-1
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-xs text-neutral-600">or</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-neutral-600 text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-500 hover:text-green-400 transition-colors font-medium">
              Create one
            </a>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-neutral-700 text-xs mt-5">
          Every calorie is data. Track it.
        </p>
      </div>
    </div>
  );
}