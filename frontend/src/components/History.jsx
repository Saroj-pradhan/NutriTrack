const History = () => {
  return (
    <div className="flex flex-col mb-25 w-[100%] min-h-[92vh] bg-[#171A1F] p-4">
            <div className="flex flex-col w-full  max-w-2xl relative overflow-hidden mx-auto  ">
     <div className="flex justify-between mb-3 items-center pl-1 pr-1">
  <p className=" text-2xl sm:text-3xl text-white font-semibold text-start mt-5">History</p>
    {/* <p className="text-sm sm:text-lg text-green-400  text-start mt-5">View History <span className="text-green-500">➜</span></p>/ */}
     </div>
      <div className="bg-[#2a2b2d] flex justify-between p-2 rounded-sm">
        <div className="flex gap-5 items-center">
          <img
            className="w-16 h-16 rounded-xl"
            src="/foods.png"
            alt="img"
          />
          <div>
            <p className="text-white text-bold text-xl">Avocado Toast</p>
            <p className="text-gray-400 text-md">12:45 pm Lunch</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-2xl text-green-400 font-bold">188</p>
          <p className="text-gray-400 text-md">KCAL</p>
        </div>
      </div>
      </div>
    </div>
  );
};
export default History;
