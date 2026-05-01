import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import CircularProgress from "../components/CircularProgress";
import AppNavBar from "../components/AppNavBar";
import { RiCameraAiFill } from "react-icons/ri";
import { GiElectric } from "react-icons/gi";
import { FaHeadSideVirus } from "react-icons/fa";
import RecentQuery from "../components/RecentQuery";
function UploadPage() {
  const navigate = useNavigate();
  const [Imgs, setImgs] = useState(null);
  const [base64Img, setBase64Img] = useState("");
  const [loading, setloading] = useState(false);
  let file = null;
  function handleChange(e) {
    console.log(e.target);
    file = e.target.files[0];
    setImgs(URL.createObjectURL(e.target.files[0]));
    localStorage.setItem(
      "FoodImage",
      `${URL.createObjectURL(e.target.files[0])}`,
    );
    const filereader = new FileReader();
    filereader.onloadend = () => {
      const base64 = filereader.result.split(",")[1];
      setBase64Img(base64);
    };
    filereader.readAsDataURL(file);
  }
  async function handelSubmittion() {
    if(!Imgs) {
      toast.error("select img first");
      return;
    }
    try {
      setloading(true);
      const data = await axios.post(`${import.meta.env.VITE_BACKEND_API}api/`, {
        image_b64: base64Img,
      });
      console.log(data);
      setloading(false);
      let Info = data?.data?.description;
      if (Info.status == 422 || Info.status == 400) {
        toast.error(`${Info.message}`);
        setloading(false);
        return;
      }
      let NutritionData = Info.items;
      console.log(NutritionData, "dattatataaa");

      localStorage.setItem("NutritionData", JSON.stringify(NutritionData));
      navigate("/result");
      console.log("After navigate");
    } catch (error) {
      console.log(error, "err");
      setloading(false);
      toast.error("server error");
    }
  }
  if (loading) return <Loader img={`${Imgs}`} />;
  return (
    <div className="w-[100%]  min-h-[92vh] bg-[#171A1F] flex  justify-center p-4 ">
    <div className="flex flex-col w-full max-w-2xl relative max-[640px]:text-center ">
      <p className="text-green-400 mb-4">Precision Health AI</p>
      <p className="text-5xl black font-bold mb-4 text-white">Fuel your <span className="text-green-400">potential.</span></p>
      <p className="text-xl  pl-2 pr-2 mb-8 text-white">
        Every calorie is data. Transform your nutritional intake into actionable biological insights with a single snap.
      </p>
      <div className="flex flex-col sm:flex-row w-100% h-[730px] sm:h-70 gap-3">
        <div className="h-[40%] sm:h-[100%] w-[100%] sm:w-[60%] rounded-xl bg-[#2a2b2d] flex flex-col items-center group">
        
           <label className="mt-4 h-40 w-[80%] rounded-2xl relative overflow-hidden ">
             <div className="z-29 absolute left-0 top-[20%] h-full w-[100%] bg-transparent flex flex-col items-center">
              <div className="bg-green-400 px-2 py-2 rounded-full w-fit">
                < RiCameraAiFill size={40} />
              </div>
              
              <p className="text-md text-white font-bold">Snap your meal to track instantly.</p>
              <p className="text-xs text-gray-300">Drag and drop or click to upload</p>
             </div>
              <div className="absolute left-0 top-5 bg-gray-500 h-full w-[100%] blur-[120px] hover:blur-[130px] ">
              
             </div>
             {Imgs ? <img src={Imgs} className="h-full w-[100%] rounded-2xl transition-transform ease-in-out duration-300 group-hover:scale-110" />: <img className=" h-full w-[100%] rounded-2xl transition-transform ease-in-out duration-300 group-hover:scale-110" src="/public/foods.png" alt="food text" />} 
          
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    {/* {Imgs && <img src={Imgs} className="mt-4 w-40" />} */}
    {/* <img className="mt-4 h-40 w-[80%]" src="https://res.cloudinary.com/dddmddgzs/image/upload/v1767606273/WhatsApp_Image_2026-01-03_at_6.44.45_PM_dzaeh9.jpg" alt="" srcset="" /> */}
  <div className="sm:flex gap-10 sm:items-center">
{(
        <button
          disabled={!Imgs}
          onClick={handelSubmittion}

          className="inline-flex items-center justify-center bg-green-400 text-black px-3 py-4 sm:px-2 sm:py-1 rounded-2xl w-[250px] sm:w-[120px] h-11 font-semibold mt-5"
        >
          Analyze now
        </button>
      )}
      <p className="text-sm text-gray-400 uppercase sm:text-[0.6rem] pt-4 ">Supported formats: JPG, PNG, HEIC</p>
      </div>
        </div>
        <div className="h-[60%] sm:h-[100%] w-[100%] sm:w-[40%] rounded-xl  flex flex-col  gap-3  ">
          <div className="h-[50%] sm:h-[50%] rounded-xl w-[100%] bg-[#2a2b2d] p-8 sm:p-3 flex flex-col justify-between ">
                  <div className="flex justify-between items-start">
                    <div className="bg-[#78f065] rounded-full w-fit ">
                     <GiElectric  size={25}/>
                   </div>
                   <p className="text-[#78f065] bg-green-900 px-1.5 font-semibold py-0.5 rounded-full">Live Tracking</p>
                  </div>
                  <div>
 <p className="text-3xl font-bold text-start text-white mb-1">1844</p>
 <p className="text-xs font-semibold text-gray-400 text-start">KCAL REMAINING</p>
                  </div>
          
          </div>
          <div className="h-[50%] sm:h-[50%] rounded-xl w-[100%] bg-[#2a2b2d] p-8 sm:p-3 flex flex-col justify-between">
 <div className="flex justify-between items-start">
                    <div className="bg-[#55eaea] rounded-full w-fit px-2 py-2 ">
                     <FaHeadSideVirus   size={25}/>
                   </div>
                   {/* <p className="text-[#62f6f8] bg-green-900 px-1.5 font-semibold py-0.5 rounded-full">Active</p> */}
                  </div>
                  <div>
 {/* <p className="text-3xl font-bold text-start text-white mb-1">1844</p> */}
 <p className="text-xs font-semibold text-gray-400 text-start">AI Engine Status</p>
 <p className="text-xs font-semibold text-green-400 text-start"><span className=" inline-block bg-green-500 h-2 w-2 rounded-full "></span>  Neural Core Active</p>
                  </div>
          
          </div>
        </div>
      </div>

     <RecentQuery/>
      
      
    
    </div>
    </div>
  );
}

export default UploadPage;