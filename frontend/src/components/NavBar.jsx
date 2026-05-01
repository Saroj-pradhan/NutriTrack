import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
const NavBar = ()=>{
    const navigate = useNavigate();
    function handelprofile(){
        navigate("/profile")
    }
    return(
        <div className="w-full h-16 bg-black flex justify-between items-center">
            <div className="flex items-center px-2 sm:px-10">
                {/* <img className="h-16 w-16" src="/pwa-192x192.png" alt="" srcset="NutriTrack img" /> */}
                <p className="text-green-400 text-2xl font-bold ">NutriTrack</p>
            </div>
            
            <div className="px-2 sm:px-10 flex gap-10">
                <div className="sm:flex gap-[4rem] hidden sm:none">
            <p className="text-white">Home</p>
            <p className="text-white">Log</p>
            <p className="text-white">History</p>
            </div>
                <CgProfile size={30} color="lightgreen" onClick={handelprofile}/>
                </div>
        </div>
    )
}
export default  NavBar;