import { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import {toast} from "react-toastify"
function Content() {
  
  const navigate = useNavigate();
    const [Imgs,setImgs] = useState(null);
    const [base64Img, setBase64Img] = useState("");
    const [loading,setloading] = useState(false);
    let file = null;
  function handleChange(e){
    console.log(e.target);
   file=e.target.files[0];
setImgs(URL.createObjectURL(e.target.files[0]))
 const filereader = new FileReader();
 filereader.onloadend = ()=>{
  const base64 = filereader.result.split(",")[1];
  setBase64Img(base64);
  console.log("base34");
  
  console.log(base64);
  
 }
 filereader.readAsDataURL(file);
  }
  async function handelSubmittion(){
    try {
console.log("submit...");
setloading(true);
       const data = await axios.post(`${import.meta.env.VITE_BACKEND_API}api/`,{
        "image_b64":base64Img
    })
    console.log(data);
    setloading(false);
    let Info =  data?.data?.description;
  if(Info.status == 422 || Info.status == 400){
    toast.error(`${Info.message}`);
    return;
  }
    let NutritionData = Info.items;
    console.log(NutritionData,"dattatataaa");
    
    localStorage.setItem("NutritionData",JSON.stringify(NutritionData))
    navigate("/result");
    console.log("After navigate");
    } catch (error) {
     console.log(error,"err");
     toast.error("server error");
    } 
  }
  if(loading) return (<Loader img={`${Imgs}`}/>);
  return (
    <div className="flex flex-col justify-center items-center">
          <p className="text-3xl black font-bold mb-4">Meet NutriTrack</p>
          <p className="text-xl sm:text-2xl mb-4">Track your calories
           with just a picture</p>
           <p className="text-lg mb-4 ">
            Meet NutriTrack, the AI-powered app for easy calorie tracking. Snap a photo, scan a barcode, or describe your meal and get instant calorie and nutrient info
           </p>
{/* <button  className="inline-flex items-center justify-center text-white bg-black px-3 py-4 rounded-lg w-[250px] h-11 font-semibold">Select Images</button>

      <input className='bg-black text-white border-2 h-[30px] w-[400px]' type="file" accept='image/*'/> */}
       <label className="bg-black text-white px-4 py-2 rounded cursor-pointer">
        Select Image
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {Imgs && <img src={Imgs} className="mt-4 w-40" />}
       {Imgs &&  
       <button onClick={handelSubmittion} className="inline-flex items-center justify-center text-white bg-black px-3 py-4 rounded-lg w-[250px] h-11 font-semibold mt-5">Submit</button>}
      </div>
  )
}

export default Content