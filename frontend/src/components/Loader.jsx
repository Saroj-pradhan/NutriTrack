import { WiStars } from "react-icons/wi";
const Loader = ({img}) => {
  return (
    <div className=" w-[100%] min-h-screen bg-black overflow-hidden ">
       <div className="absolute top-1/2 left-2/4 blur-[140px] sm:blur-[220px] w-[45vw] h-[38vh] bg-green-500  rounded-full"></div>
      <div className=" max-w-[320px] pt-10 text-white container mx-auto flex flex-col  items-center">
       <div className="w-[90%]   h-[270px] relative">
       
       <div className="absolute left-2 top-7  bg-gray-800 z-50 rounded-2xl py-0.5 px-1.5 flex gap-1 items-center">
        <div className="bg-green-400 rounded-full h-1.5 w-1.5"></div>
 <p className=" text-white text-sm capitalize font-extralight">PROTEIN</p>
       </div>
           
           <div className="absolute right-2 bottom-7  bg-gray-800 z-50 rounded-2xl py-0.5 px-1.5 flex gap-1 items-center">
        <div className="bg-green-400 rounded-full h-1.5 w-1.5"></div>
 <p className=" text-white text-sm capitalize font-extralight">CARBS</p>
       </div>
           
     
       <img
          className="w-[100%] h-[100%] rounded-2xl blur-xs"
          src={img}
          alt="food images"
        />
        {/* <div className="h-1 absolute w-full bg-green-500"></div> */}
         <div
        className="absolute top-0 left-0 w-[99%] h-[2px] bg-green-400 shadow-[0_0_10px_#22c55e]"
        style={{
          animation: "scan 2s ease-in infinite"
        }}
      ></div>
       </div>
        <p className="text-xl font-bold mt-4 mb-2">AI is analyzing your meal......</p>
         <p className="text-xl text-gray-200  mb-2">identifying food items....</p>
          <div className="w-[94%] mt-1.5 h-[64px] bg-black rounded-xl flex items-center gap-2 p-2">
       <p className="text-green-400 text-4xl  px-0.5 py-0.5 rounded-2xl" >
        <WiStars/>
       </p>
       <div>
        <p className="text-md font-semibold">Did you know ?</p>
       <p className="text-[11px]">Analyzing macro-ratios in real-time helps your AI coach tailor your next workout intensity.</p>
    
       </div>
        </div>
      </div>
      
    
      <style>
        {`@keyframes scan{
            0% {
            transform:translateY(0%);
            }
            100% {
                transform:translateY(270px);
            }
        }
        `}
      </style>
  
    </div>
  );
};
export default Loader;
