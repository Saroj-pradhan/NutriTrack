import React from 'react'
import { useNavigate } from 'react-router-dom'
function RecentQuery() {
  const navigate = useNavigate();
  function handelHistory(){
    navigate("/history")
  }
  return (
    <div className="flex flex-col mt-5 mb-25 ">
         <div className="flex justify-between mt-5 mb-3 items-center pl-1 pr-1 ">
  <p className=" text-xl sm:text-2xl text-white font-semibold  ">Recently uploaded</p>
    <p onClick={handelHistory} className="text-sm sm:text-lg text-green-400  text-start mt-5">View History <span className="text-green-500">➜</span></p>
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
  )
}

export default RecentQuery