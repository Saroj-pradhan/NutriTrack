// import { CgProfile } from "react-icons/cg";
// import { useNavigate } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// const NavBar = ()=>{
//     const navigate = useNavigate();
//     function handelprofile(){
//         navigate("/profile")
//     }
//     return(
//         <div className="w-full h-16 bg-black flex justify-between items-center">
//             <div className="flex items-center px-2 sm:px-10">
//                 {/* <img className="h-16 w-16" src="/pwa-192x192.png" alt="" srcset="NutriTrack img" /> */}
//                 {/* <p className="text-green-400 text-2xl font-bold ">NutriTrack</p> */}
//                 {/* <div className="flex items-center gap-2.5 mb-8"> */}
//             <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//               </svg>
//             </div>
//             <span className="text-white font-semibold text-base tracking-wide ml-3">NutriTrack</span>
//           </div>
//             {/* </div> */}
            
//             <div className="px-2 sm:px-10 flex gap-10">
//                 <div className="sm:flex gap-[4rem] hidden sm:none">
//             <NavLink to="/home"  className={({isActive})=> isActive?"text-green-400":"text-white"}>Home</NavLink>
//             <NavLink to="/log"  className={({isActive})=> isActive?"text-green-400":"text-white"}>Log</NavLink>
//             <NavLink to="/history"  className={({isActive})=> isActive?"text-green-400":"text-white"}>History</NavLink>
//             </div>
//                 <CgProfile size={30} color="lightgreen" onClick={handelprofile}/>
//                 </div>
//         </div>
//     )
// }
// export default  NavBar;
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const LINKS = [
  { label: "Home",    path: "/home"    },
  { label: "Log",     path: "/log"     },
  { label: "History", path: "/history" },
];

const NavBar = () => {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        background: "rgba(9,9,9,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4 sm:px-8">

        {/* ── Logo ─────────────────────────────────────── */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2.5 outline-none group"
        >
          <div
            className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:shadow-[0_0_14px_rgba(0,230,118,0.5)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="black" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span
            className="text-white font-bold text-base tracking-wide"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            NutriTrack
          </span>
        </button>

        {/* ── Desktop nav links ─────────────────────────── */}
        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map(({ label, path }) => {
            const active = pathname === path || pathname.startsWith(path + "/");
            return (
              <NavLink
                key={path}
                to={path}
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 outline-none"
                style={{
                  color: active ? "#00e676" : "#6b7280",
                  background: active ? "rgba(0,230,118,0.08)" : "transparent",
                  border: active ? "1px solid rgba(0,230,118,0.15)" : "1px solid transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute top-1.5 right-2 w-1 h-1 rounded-full bg-green-400"
                    style={{ boxShadow: "0 0 5px #00e676" }}
                  />
                )}
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Right: profile ────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="group flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900 hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-200 outline-none"
            aria-label="Profile"
          >
            <CgProfile
              size={20}
              className="transition-colors duration-200"
              style={{ color: "#6b7280" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00e676")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
            />
          </button>
        </div>

      </div>
    </header>
  );
};

export default NavBar;