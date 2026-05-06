import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
const NavBar = ()=>{
    const navigate = useNavigate();
    function handelprofile(){
        navigate("/profile")
    }
    return(
        <div className="w-full h-16 bg-black flex justify-between items-center">
            <div className="flex items-center px-2 sm:px-10">
                {/* <img className="h-16 w-16" src="/pwa-192x192.png" alt="" srcset="NutriTrack img" /> */}
                {/* <p className="text-green-400 text-2xl font-bold ">NutriTrack</p> */}
                {/* <div className="flex items-center gap-2.5 mb-8"> */}
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-wide ml-3">NutriTrack</span>
          </div>
            {/* </div> */}
            
            <div className="px-2 sm:px-10 flex gap-10">
                <div className="sm:flex gap-[4rem] hidden sm:none">
            <NavLink to="/home"  className={({isActive})=> isActive?"text-green-400":"text-white"}>Home</NavLink>
            <NavLink to="/log"  className={({isActive})=> isActive?"text-green-400":"text-white"}>Log</NavLink>
            <NavLink to="/history"  className={({isActive})=> isActive?"text-green-400":"text-white"}>History</NavLink>
            </div>
                <CgProfile size={30} color="lightgreen" onClick={handelprofile}/>
                </div>
        </div>
    )
}
export default  NavBar;