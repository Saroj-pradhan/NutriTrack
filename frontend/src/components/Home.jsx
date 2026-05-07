// import { NavLink } from "react-router-dom"
// function Home() {
//   return (
//     <div className=" flex flex-col sm:flex-row justify-end">
//        <div className="sm:h-screen sm:w-[50%] w-[100%] flex flex-col px-2 mb-10  sm:mb-0 sm:mx-10 mt-10 sm:mt-26">
//           <p className="text-6xl black font-bold mb-4">Meet NutriTrack</p>
//           <p className="text-5xl mb-4">Track your calories<br></br>
//            with just a picture</p>
//            <p className="text-xl mb-4">
//             Meet NutriTrack, the AI-powered app for easy calorie tracking. Snap a photo, scan a barcode, or describe your meal and get instant calorie and nutrient info
//            </p>
// <NavLink to="/home" className="inline-flex items-center justify-center text-white bg-black px-2 py-3 rounded-lg w-[250px] h-11 font-semibold">Get Started</NavLink>
//       </div>
//       <div className="h-screen sm:w-[50%] w-[100%]">
//         <img className="sm:h-[90%] sm:w-full" src="https://res.cloudinary.com/dddmddgzs/image/upload/v1772681688/hero-image_yy60gz.webp" alt="" srcset="" />
//       </div>
//     </div>
//   )
// }

// export default Home

import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ── Utility: simple intersection observer hook ──────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Floating orb background ─────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ width: 600, height: 600, top: -200, left: -200, background: "radial-gradient(circle, #00e676 0%, transparent 70%)", animationDuration: "4s" }} />
      <div className="absolute rounded-full blur-3xl opacity-10 animate-pulse"
        style={{ width: 400, height: 400, bottom: 100, right: -100, background: "radial-gradient(circle, #00e676 0%, transparent 70%)", animationDuration: "6s", animationDelay: "2s" }} />
    </div>
  );
}

// ── Dot-grid texture overlay ────────────────────────────────────────────────
const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, #1f1f1f 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

// ── Pill badge ──────────────────────────────────────────────────────────────
function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
      {children}
    </span>
  );
}

// ── Macro chip ──────────────────────────────────────────────────────────────
function MacroChip({ label, value, color }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur px-5 py-4 gap-1 min-w-[90px]">
      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1" style={{ borderColor: color }}>
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      <p className="text-white font-bold text-lg leading-none">{value}</p>
      <p className="text-neutral-500 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ── Feature card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay = 0, inView }) {
  return (
    <div
      className="group bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-green-500/40 transition-all duration-500 hover:-translate-y-1"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s`,
      }}
    >
      <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl group-hover:bg-green-500/20 transition-colors duration-300">
        {icon}
      </div>
      <p className="text-white font-semibold text-base">{title}</p>
      <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Step card ───────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, inView, delay = 0 }) {
  return (
    <div
      className="flex gap-4 items-start"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="w-10 h-10 rounded-full bg-green-500 text-black font-black text-base flex items-center justify-center flex-shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <p className="text-white font-semibold text-base mb-1">{title}</p>
        <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── Mock phone UI ────────────────────────────────────────────────────────────
function MockPhone() {
  return (
    <div className="relative mx-auto" style={{ width: 220, height: 440 }}>
      {/* Phone shell */}
      <div className="absolute inset-0 rounded-[36px] border-2 border-neutral-700 bg-neutral-950 overflow-hidden shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="w-16 h-1.5 rounded-full bg-green-500/40" />
          <div className="w-16 h-4 rounded-full bg-neutral-800" />
        </div>
        {/* App header */}
        <div className="flex items-center gap-2 px-4 pb-2">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
            <span className="text-black text-xs font-black">N</span>
          </div>
          <span className="text-white text-xs font-semibold">NutriTrack</span>
        </div>
        {/* Calorie ring mock */}
        <div className="flex flex-col items-center py-3">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="#00e676" strokeWidth="8"
                strokeDasharray="201" strokeDashoffset="50" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-green-400 font-black text-base leading-none">84%</p>
              <p className="text-neutral-500 text-[9px]">goal</p>
            </div>
          </div>
          <p className="text-white font-bold text-xl mt-1">1,840</p>
          <p className="text-neutral-500 text-[10px]">kcal today</p>
        </div>
        {/* Macro row */}
        <div className="flex justify-around px-3 mb-3">
          {[["P","142g","#4ade80"],["C","210g","#60a5fa"],["F","14g","#f59e0b"]].map(([l,v,c])=>(
            <div key={l} className="flex flex-col items-center gap-0.5">
              <p className="text-[10px] font-bold" style={{color:c}}>{v}</p>
              <p className="text-neutral-600 text-[9px]">{l}</p>
            </div>
          ))}
        </div>
        {/* Meal list */}
        <div className="px-3 flex flex-col gap-2">
          {[["🥑","Avocado Toast","320"],["🐟","Grilled Salmon","495"],["🍚","Quinoa Bowl","380"]].map(([e,n,c])=>(
            <div key={n} className="flex items-center gap-2 bg-neutral-900 rounded-xl px-3 py-2">
              <span className="text-sm">{e}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-semibold truncate">{n}</p>
              </div>
              <p className="text-green-400 text-[10px] font-bold">{c}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Glow under phone */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full blur-xl bg-green-500/30" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ════════════════════════════════════════════════════════════════════════════
function SectionHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 pt-24 pb-16 overflow-hidden" style={DOT_GRID}>
      <Orbs />

      {/* Left copy */}
      <div className="relative z-10 flex flex-col items-start max-w-xl">
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <Badge>Precision Health AI</Badge>
        </div>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(28px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", fontFamily: "'Syne', sans-serif" }}
        >
          Fuel your<br />
          <span className="text-green-400">potential.</span>
        </h1>
        <p
          className="text-neutral-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-md"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}
        >
          Snap a meal or describe what you ate — our AI breaks down every macro instantly. Every calorie is data.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
        >
          <NavLink
            to="/signup"
            className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-4 rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,230,118,0.4)] active:scale-95"
          >
            Get Started — it's free
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NavLink>
          <NavLink
            to="/login"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold px-7 py-4 rounded-xl text-sm transition-all duration-200"
          >
            Sign In
          </NavLink>
        </div>

        {/* Social proof */}
        <div
          className="flex items-center gap-3 mt-8"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.45s" }}
        >
          <div className="flex -space-x-2">
            {["#00e676","#4ade80","#86efac","#bbf7d0"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[9px] font-bold" style={{ background: c, color: "#000" }}>
                {["A","B","C","D"][i]}
              </div>
            ))}
          </div>
          <p className="text-neutral-500 text-xs">
            <span className="text-white font-semibold">12,000+</span> people tracking smarter
          </p>
        </div>
      </div>

      {/* Right phone mock */}
      <div
        className="relative z-10 hidden lg:block"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(40px) scale(0.95)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s" }}
      >
        {/* Floating chips */}
        <div className="absolute -top-6 -left-10 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl animate-bounce" style={{ animationDuration: "3s" }}>
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-white text-xs font-bold">1,840 kcal</p>
            <p className="text-neutral-500 text-[10px]">Today's intake</p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-10 bg-green-500/10 border border-green-500/30 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
          <span className="text-lg">✅</span>
          <div>
            <p className="text-green-400 text-xs font-bold">Goal hit!</p>
            <p className="text-neutral-500 text-[10px]">84% complete</p>
          </div>
        </div>
        <MockPhone />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2 — FEATURES
// ════════════════════════════════════════════════════════════════════════════
function SectionFeatures() {
  const [ref, inView] = useInView();
  const features = [
    { icon: "📸", title: "Snap & Analyze", desc: "Photo-based meal recognition powered by computer vision. Point, shoot, done — macros in seconds.", delay: 0 },
    { icon: "🧠", title: "AI Engine", desc: "Neural Core processes your meals against a 500,000+ food database for pinpoint accuracy.", delay: 100 },
    { icon: "📊", title: "Macro Breakdown", desc: "See protein, carbs, fats, and calories for every item. Know exactly what's on your plate.", delay: 200 },
    { icon: "📅", title: "Day-by-Day History", desc: "Browse your complete nutrition log. Spot patterns, celebrate wins, course-correct fast.", delay: 300 },
    { icon: "🎯", title: "Goal Targeting", desc: "Lose, gain, or maintain — we calculate your personalised daily calorie target automatically.", delay: 400 },
    { icon: "⚡", title: "Instant Logging", desc: "Type a meal, describe it in plain English, or scan an image. All three paths are equally fast.", delay: 500 },
  ];

  return (
    <section ref={ref} className="relative px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-14"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
        <Badge>Why NutriTrack</Badge>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          Built for real life,<br /><span className="text-green-400">not spreadsheets.</span>
        </h2>
        <p className="text-neutral-500 mt-4 text-lg max-w-lg mx-auto">Logging food used to be a chore. We made it a superpower.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(f => <FeatureCard key={f.title} {...f} inView={inView} />)}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3 — HOW IT WORKS
// ════════════════════════════════════════════════════════════════════════════
function SectionHowItWorks() {
  const [ref, inView] = useInView();
  const steps = [
    { num: "1", title: "Create your profile", desc: "Tell us your goals — lose, gain, or maintain. We calculate your personalised calorie & macro targets instantly.", delay: 0 },
    { num: "2", title: "Log your meals", desc: "Snap a photo, type a description, or browse our food library. The AI fills in the nutrients for you.", delay: 120 },
    { num: "3", title: "Track your progress", desc: "Watch your daily totals fill up. Stay inside your budget, hit your macros, and hit your goals faster.", delay: 240 },
  ];

  return (
    <section ref={ref} className="relative py-24 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,230,118,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: steps */}
        <div className="flex flex-col gap-8">
          <div style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease" }}>
            <Badge>How it works</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              Three steps to<br /><span className="text-green-400">know your body.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-7">
            {steps.map(s => <StepCard key={s.num} {...s} inView={inView} />)}
          </div>
          <div style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
            <NavLink
              to="/signup"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,230,118,0.35)]"
            >
              Start for free →
            </NavLink>
          </div>
        </div>

        {/* Right: visual panel */}
        <div
          className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col gap-5"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(30px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-bold text-base">Today's Summary</p>
            <span className="text-green-500 text-xs font-semibold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Live</span>
          </div>

          {/* Big calorie number */}
          <div className="text-center py-4">
            <p className="text-6xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>1,840</p>
            <p className="text-neutral-500 text-sm mt-1">kcal consumed</p>
          </div>

          {/* Macro bars */}
          {[
            { label: "Protein", val: 142, max: 180, unit: "g", color: "#4ade80" },
            { label: "Carbs",   val: 210, max: 280, unit: "g", color: "#60a5fa" },
            { label: "Fats",    val: 14,  max: 60,  unit: "g", color: "#f59e0b" },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-400">{m.label}</span>
                <span className="font-semibold" style={{ color: m.color }}>{m.val}{m.unit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: inView ? `${(m.val / m.max) * 100}%` : "0%", background: m.color, transitionDelay: "0.4s" }}
                />
              </div>
            </div>
          ))}

          {/* Recent items */}
          <div className="flex flex-col gap-2 mt-2">
            {[["🥑","Avocado Toast","320 cal"],["🐟","Grilled Salmon","495 cal"],["🍚","Quinoa Bowl","380 cal"]].map(([e,n,c])=>(
              <div key={n} className="flex items-center gap-3 bg-neutral-900 rounded-xl px-4 py-3">
                <span className="text-lg">{e}</span>
                <p className="flex-1 text-sm text-white font-medium">{n}</p>
                <p className="text-green-400 text-xs font-bold">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4 — STATS + CTA
// ════════════════════════════════════════════════════════════════════════════
function SectionCTA() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="relative py-24 px-6" style={DOT_GRID}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,230,118,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto">
        {/* Stats row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
        >
          {[
            { val: 12000, suffix: "+", label: "Active users" },
            { val: 50000, suffix: "+", label: "Foods in database" },
            { val: 98, suffix: "%", label: "Accuracy rate" },
            { val: 3, suffix: "sec", label: "Avg. scan time" },
          ].map(s => (
            <div key={s.label} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 text-center hover:border-green-500/30 transition-colors duration-300">
              <p className="text-2xl font-black text-green-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                <Counter target={s.val} suffix={s.suffix} />
              </p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Final CTA card */}
        <div
          className="relative rounded-3xl border border-green-500/20 overflow-hidden text-center px-8 py-16"
          style={{
            background: "linear-gradient(135deg, rgba(0,230,118,0.06) 0%, rgba(0,0,0,0) 60%)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(30px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s"
          }}
        >
          <div className="absolute inset-0 pointer-events-none border border-green-500/10 rounded-3xl" />
          <Badge>Start today</Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mt-4 mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
            Every calorie<br />is <span className="text-green-400">data.</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto mb-8">
            Join thousands who turned guesswork into a science. Your transformation starts with one snap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <NavLink
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(0,230,118,0.45)] active:scale-95"
            >
              Get Started — Free
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </NavLink>
            <NavLink
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold px-8 py-4 rounded-xl text-sm transition-all duration-200"
            >
              Already have an account
            </NavLink>
          </div>
          <p className="text-neutral-600 text-xs mt-5">No credit card required · Takes 60 seconds</p>
        </div>
      </div>
    </section>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
      style={{ background: scrolled ? "rgba(9,9,9,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>NutriTrack</span>
      </div>
      <div className="hidden sm:flex items-center gap-6">
        {["Features","How it works","Pricing"].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(" ","-")}`} className="text-neutral-400 hover:text-white text-sm transition-colors duration-200">{l}</a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <NavLink to="/login" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">Sign in</NavLink>
        <NavLink
          to="/signup"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors duration-200"
        >
          Get Started
        </NavLink>
      </div>
    </nav>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-neutral-900 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
            <span className="text-black text-xs font-black">N</span>
          </div>
          <span className="text-neutral-500 text-sm">NutriTrack © 2026</span>
        </div>
        <p className="text-neutral-700 text-xs">Every calorie is data. Track it.</p>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ════════════════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div className="bg-black min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* <Navbar /> */}
      <main>
        <SectionHero />
        <SectionFeatures />
        <SectionHowItWorks />
        <SectionCTA />
      </main>
      <Footer />
    </div>
  );
}