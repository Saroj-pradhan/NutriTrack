// import { GoHome } from "react-icons/go";
// import { TbBrandGoogleAnalytics } from "react-icons/tb";
// import { IoSettingsOutline } from "react-icons/io5";
// import { MdOutlineQrCodeScanner , MdOutlinePlaylistAddCheck , MdHistory} from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// function AppNavBar() {
//     const navigate = useNavigate();
//     function NavigateToLog(){
//     navigate("/log")
//     }
//     function NavigateToHome(){
//     navigate("/home")
//     }
//     function NavigateToAnalyse(){
//         navigate("/history")
//     }
//   return (
//      <div className="fixed  bottom-0 left-0 w-[100%] flex items-center justify-evenly text-white backdrop-blur-sm md:ml-5 md:mr-7  sm:hidden">
     
//       <div className="flex flex-col items-center" onClick={NavigateToHome}>
//         <GoHome size={25}/>
//         <p>Home</p>
//       </div>
//       <div className="flex flex-col items-center" onClick={NavigateToLog} >    
//       < MdOutlinePlaylistAddCheck   size={25} />
//       <p>Log</p>
//       </div>
//       <div className="flex flex-col items-center" onClick={NavigateToAnalyse}>
//         <MdHistory size={25} />
//         <p>History</p>
//       </div>
//        {/* <div className="h-14 w-14 bg-white rounded-full sm:hidden flex justify-center items-center ">
// <p className="text-6xl text-black">+</p>
//       </div> */}
//     </div>
//   )
// }

// export default AppNavBar
import { useNavigate, useLocation } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlinePlaylistAddCheck, MdPlaylistAddCheck, MdHistory } from "react-icons/md";
import { RiHistoryFill } from "react-icons/ri";

const TABS = [
  {
    label: "Home",
    path: "/home",
    Icon: GoHome,
    ActiveIcon: GoHomeFill,
  },
  {
    label: "Log",
    path: "/log",
    Icon: MdOutlinePlaylistAddCheck,
    ActiveIcon: MdPlaylistAddCheck,
  },
  {
    label: "History",
    path: "/history",
    Icon: MdHistory,
    ActiveIcon: RiHistoryFill,
  },
];

export default function AppNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      {/* Spacer so page content isn't hidden behind navbar */}
      <div className="h-20 sm:hidden" />

      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        {/* Blur + border backdrop */}
        <div
          className="relative mx-3 mb-3 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(13,13,13,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,230,118,0.04)",
          }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {TABS.map(({ label, path, Icon, ActiveIcon }) => {
              const active = pathname === path || pathname.startsWith(path + "/");
              const Ic = active ? ActiveIcon : Icon;

              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 outline-none"
                  style={{
                    background: active ? "rgba(0,230,118,0.08)" : "transparent",
                    border: active ? "1px solid rgba(0,230,118,0.15)" : "1px solid transparent",
                  }}
                >
                  {/* Active glow dot */}
                  {active && (
                    <span
                      className="absolute top-1.5 right-4 w-1 h-1 rounded-full bg-green-400"
                      style={{ boxShadow: "0 0 6px #00e676" }}
                    />
                  )}

                  {/* Icon */}
                  <Ic
                    size={22}
                    style={{
                      color: active ? "#00e676" : "#4b4b4b",
                      filter: active ? "drop-shadow(0 0 6px rgba(0,230,118,0.6))" : "none",
                      transition: "color 0.2s, filter 0.2s",
                    }}
                  />

                  {/* Label */}
                  <span
                    className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                    style={{ color: active ? "#00e676" : "#4b4b4b" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}