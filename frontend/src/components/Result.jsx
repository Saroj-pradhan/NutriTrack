import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dumbbell, Bone, Weight, Plus } from "lucide-react";
import { MdOutlineWaterDrop } from "react-icons/md";
function Result() {
  const [NutritionDataa, setNutritionData] = useState([
    { name: "Product Name", calories: 0, protein: 0, carbs: 0, fat: 0 },
  ]);
  const [selectedVals, setSelectedVals] = useState({});
  const stored = localStorage.getItem("NutritionData");
  const NutritionData = stored ? JSON.parse(stored) : null;
  console.log(NutritionData);
  console.log(NutritionDataa, "kkkkkkkk");

  // setNutritionData(NutritionInfo);
  useEffect(() => {
    console.log("hayyyyyyyyy");
    setNutritionData(NutritionData);
  }, []);
  let imgs = localStorage.getItem("FoodImage");
  const option = [100, 150, 200];
  const [val, setval] = useState(100);
  if (!NutritionData.length) {
    return <div>Data Not Found</div>;
  }
  function handelQuantity(op , index) {
    setSelectedVals((prev)=>({
...prev,[index]:op
    }))
    setval(op);
    let v = op / 100;
    setNutritionData(
     NutritionData.map((dt,i) => (i===index?{
        ...dt,
        calories: parseFloat(dt.calories * v).toFixed(2),
        protein: parseFloat(dt.protein * v).toFixed(1),
        carbs: parseFloat(dt.carbs * v).toFixed(1),
        fat: parseFloat(dt.fat * v).toFixed(1),
      }:{...dt})),
    );
  }
  console.log("jfjfjfjfjfjfjjjf");
  function calculateCalories(e , index) {
    console.log(e.target.value);
    let input = Number(e.target.value);
    if (e.target.value == "") {
      input = 100;
      toast.error("can not empty");
    }
    // setval(input);
    console.log("clicked");
    let v = input / 100;
 console.log(NutritionData);
 
  setNutritionData(
      NutritionData.map((dt,i) => (i===index?{
        ...dt,
        calories: parseFloat(dt.calories * v).toFixed(2),
        protein: parseFloat(dt.protein * v).toFixed(1),
        carbs: parseFloat(dt.carbs * v).toFixed(1),
        fat: parseFloat(dt.fat * v).toFixed(1),
      }:{...dt})),
    );
  }
  function AddCalories(e) {
    e.preventDefault();
    console.log("e is workinhg");
    
    console.log("clicked");
  }
  return (
    <div className="bg-[#020B18] min-h-screen flex width-[100%]  justify-center">
      <div className="max-w-[350px] ">
        <img
          className="w-[350px] rounded-2xl max-h-[250px]"
          src={imgs}
          alt=""
          srcset=""
        />
        <p className="text-xl font-semibold text-green-500 capitalize mt-2">
          AI Detection Result
        </p>
        {NutritionDataa.map((dt,index) => (
          <div className="mt-2">
            <p className="text-white text-2xl"> {dt.name}</p>
            <div className="w-full rounded-2xl p-3 text-white bg-[#252b32] mt-4">
              <p className="">Total Calories</p>
              <p className="text-gray-300">
                <span className="text-4xl text-green-400 font-bold">
                  {dt.calories}{" "}
                </span>
                kcal
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="min-w-[48%] rounded-2xl p-3 text-white bg-[#252b32]">
                <div className="flex items-center gap-2">
                  <Dumbbell size={17} color="lightgreen" />{" "}
                  <span className="text-white uppercase "> Protein</span>
                </div>
                <p className="text-2xl font-bold">
                  {dt.protein} <span className="text-[#7b7b7b] text-sm">g</span>
                </p>
              </div>
              <div className="min-w-[48%] rounded-2xl p-3 text-white bg-[#252b32]">
                <div className="flex items-center gap-2">
                  <Bone size={17} color="cyan" />
                  <span className="text-white uppercase ">CARBS </span>
                </div>
                <p className="text-2xl font-bold">
                  {dt.carbs} <span className="text-[#7b7b7b] text-sm">g</span>
                </p>
              </div>
              <div className="min-w-[48%] rounded-2xl p-3 text-white bg-[#252b32]">
                <div className="flex items-center gap-2">
                  <MdOutlineWaterDrop color="lightgreen" />
                  <span className="text-white uppercase ">Fat</span>
                </div>
                <p className="text-2xl font-bold">
                  {dt.fat} <span className="text-[#7b7b7b] text-sm">g</span>
                </p>
              </div>
              <div className="min-w-[48%] rounded-2xl p-3 text-white bg-[#252b32]">
                <div className="flex items-center gap-2">
                  <Weight size={17} color="gray" strokeWidth={3} />
                  <span className="text-white uppercase ">base</span>
                </div>
                <p className="text-2xl font-bold">
                  {val} <span className="text-[#7b7b7b] text-sm">g</span>
                </p>
              </div>
            </div>
            <p className="uppercase text-gray-400 mt-5">Portion Selection</p>
            <div className="mt-2 text-white flex">
              {option.map((op) => (
                <button
                  onClick={() => handelQuantity(op , index)}
                  className={`${op == val && selectedVals[index] == op ? "bg-green-400" : "bg-[#252b32]"} w-[33%] h-12  rounded-2xl m-1`}
                  key={op}
                >{`${op} g`}</button>
              ))}
            </div>
            <form action="" id="myForm" onSubmit={(e) => AddCalories(e)}>
              <input
                onChange={(e) => calculateCalories(e , index)}
                placeholder="📝 Custom Weight (g)"
                className="w-full rounded-4xl  p-3 text-white bg-[#252b32] mt-4 outline-none  focus:border-1 focus:border-green-400"
              ></input>
             
            </form>
          </div>
        ))}
         <button
                className="w-full rounded-4xl  p-3 text-black font-bold  mt-4 outline-none  bg-green-400 focus:border-green-400 mb-5 flex justify-center gap-2"
                type="submit"
                form="myForm"
              >
                {" "}
                <Plus
                  strokeWidth={3}
                  className="bg-black text-green-400  rounded-full"
                />{" "}
                Add to Daily Log
              </button>
      </div>
    </div>
  );
}

export default Result;
