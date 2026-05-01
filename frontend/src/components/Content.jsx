import { useEffect, useState } from "react";   
import { toast } from "react-toastify";
import RecentQuery from "./RecentQuery";
import CircularProgress from "./CircularProgress";
function Content(){
  const [selectedDate,setselectedDate] = useState(new Date().toISOString().split("T")[0]);
  //  const [dummyDate,setdummyDate] = useState(new Date().toISOString().split("T")[0]);
   const dummyDate = getdummyDates();
  const [Dates,setDates] = useState([new Date().toISOString().split("T")[0]]);
  useEffect(()=>{
getNDays(16);
  },[])
  function getNDays(n){
    const NDates = [];
    let currentDay = new Date();
   for(let i=0;i<n;i++){ 
    
       let newDate = currentDay;
       console.log(newDate,"newDt");
       
newDate.setDate(newDate.getDate()-i);
console.log(newDate,"chnage");

 NDates.push(newDate.toISOString().split("T")[0]);
    }
    setDates([...NDates.reverse()]);
    console.log("dddddddddddtttttttttt");
  console.log(Dates);
  console.log(selectedDate)
  }
  function getdummyDates(){
    let arr = [];
    
    for(let i =1;i<=2;i++){
      let dt = new Date();
       dt.setDate(dt.getDate() + i);
arr.push(dt.toISOString().split("T")[0])
    }
    return arr;
  }
   function handelDateChanges(dt){
    setselectedDate(dt);
   }
   const getDay = (date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  
  return (
    <div className="w-[100%] min-h-[92vh] bg-[#171A1F] flex  justify-center p-4 ">
    <div className="flex flex-col w-full  max-w-2xl relative overflow-hidden mx-auto  ">
      <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar mt-2 mb-5 snap-x snap-mandatory scroll-smooth">
       { Dates.map((dt)=> (
         <div className={`flex flex-col items-center justify-center ${selectedDate == dt ?"bg-green-400 h-20 min-w-[50px]":"bg-[#343838] text-white h-16 min-w-[48px]"} rounded-2xl   p-2 flex-shrink-0 snap-center`}
         onClick={()=>handelDateChanges(dt)}
         >
          <p>{getDay(dt)}</p>
          <p>{dt.split("-")[2]}</p>
        </div>
        ))}
              
              { dummyDate.map((dt)=> (
         <div className={`flex flex-col items-center justify-center ${selectedDate == dt ?"bg-green-400 h-20 min-w-[50px]":"bg-[#6e6e6e] text-white h-16 min-w-[48px]"} rounded-2xl   p-2 flex-shrink-0 snap-center`}
         
         >
          <p>{getDay(dt)}</p>
          <p>{dt.split("-")[2]}</p>
        </div>
        ))}
      </div>
      
      <div className="bg-[#252a2a] max-[480px]: max-[480px]:h-102 h-54 rounded-xl w-[100%] flex max-[480px]:flex-col p-2 max-[480px]:justify-center ">
        <div className=" max-[480px]:h-[50%] max-[480px]:w-[100%] h-[100%] w-[40%] flex justify-center items-center text-white">
           <CircularProgress percent = {90} />
        </div>
        <div className=" max-[480px]:h-[50%] max-[480px]:w-[100%] h-[100%] w-[60%] sm:pl-5 pl-5 p-2 mb-4 ">
          <div>
            <p className="text-xl uppercase text-gray-200 font-semibold">Daily Summary</p>
            <p className="text-2xl text-gray-400 font-bold"><span className="text-6xl text-green-400">1840</span> / 2200</p>
          </div>
          <div className="flex mt-5 gap-5 sm:gap-6">
                <div className="flex flex-col items-center gap-2 bg-black rounded-2xl  w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2  justify-start">
                  <span className="text-gray-400 uppercase ">Protein </span>
                  <p className="text-white font-bold">142g</p>
                </div>
                 <div className="flex flex-col items-center gap-2 bg-black rounded-2xl w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2  justify-start">
                  <span className="text-gray-400 uppercase ">CARBS </span>
                  <p className="text-white font-bold">142g</p>
                </div>
                 <div className="flex flex-col items-center gap-2 bg-black rounded-2xl w-fit max-[480px]:w-24 sm:w-24 pt-2 pb-2 pl-3 pr-2 justify-start">
                  <span className="text-gray-400 uppercase ">fatS </span>
                  <p className="text-white font-bold">142g</p>
                </div>
          </div>
        </div>
      </div>
<RecentQuery/>
    </div>
    </div>
  );
}

export default Content;
