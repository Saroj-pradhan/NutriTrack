import { GoHome } from "react-icons/go";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineQrCodeScanner , MdOutlinePlaylistAddCheck , MdHistory} from "react-icons/md";
import { useNavigate } from "react-router-dom";

function AppNavBar() {
    const navigate = useNavigate();
    function NavigateToLog(){
    navigate("/log")
    }
    function NavigateToHome(){
    navigate("/home")
    }
    function NavigateToAnalyse(){
        navigate("/history")
    }
  return (
     <div className="fixed  bottom-0 left-0 w-[100%] flex items-center justify-evenly text-white backdrop-blur-sm md:ml-5 md:mr-7  sm:hidden">
     
      <div className="flex flex-col items-center" onClick={NavigateToHome}>
        <GoHome size={25}/>
        <p>Home</p>
      </div>
      <div className="flex flex-col items-center" onClick={NavigateToLog} >    
      < MdOutlinePlaylistAddCheck   size={25} />
      <p>Log</p>
      </div>
      <div className="flex flex-col items-center" onClick={NavigateToAnalyse}>
        <MdHistory size={25} />
        <p>History</p>
      </div>
       {/* <div className="h-14 w-14 bg-white rounded-full sm:hidden flex justify-center items-center ">
<p className="text-6xl text-black">+</p>
      </div> */}
    </div>
  )
}

export default AppNavBar