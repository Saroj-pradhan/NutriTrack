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
  { label: "Home",    path: "/home",    Icon: GoHome,                   ActiveIcon: GoHomeFill         },
  { label: "Log",     path: "/log",     Icon: MdOutlinePlaylistAddCheck, ActiveIcon: MdPlaylistAddCheck },
  { label: "History", path: "/history", Icon: MdHistory,                 ActiveIcon: RiHistoryFill      },
];

export default function AppNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    // Full-width flush bottom — no spacer div causing whitespace
    <nav
      className="fixed bottom-0 left-0 w-full z-50 sm:hidden flex items-center justify-evenly"
      style={{
        background: "rgba(13,13,13,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
        height: 60,
      }}
    >
      {TABS.map(({ label, path, Icon, ActiveIcon }) => {
        const active = pathname === path || pathname.startsWith(path + "/");
        const Ic = active ? ActiveIcon : Icon;

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full outline-none active:scale-95 transition-transform duration-150"
          >
            {/* Active indicator — thin green bar at top of tab */}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-green-400"
                style={{ boxShadow: "0 0 8px #00e676" }}
              />
            )}

            <Ic
              size={23}
              style={{
                color: active ? "#00e676" : "#4b4b4b",
                filter: active ? "drop-shadow(0 0 5px rgba(0,230,118,0.55))" : "none",
                transition: "color 0.2s, filter 0.2s",
              }}
            />

            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? "#00e676" : "#4b4b4b", transition: "color 0.2s" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}