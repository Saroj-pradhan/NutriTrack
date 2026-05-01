const CircularProgress = ({ percent = 84 })=>{
 const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return(
    <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90">
            <circle  
          cx="92"
          cy="92"
          r={radius}
          className="fill-none"
          strokeWidth="12"/>

         <circle
          cx="92"
          cy="92"
          r={radius}
          className="fill-none stroke-green-500 transition-all duration-500 ease-in-out"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        </svg>
         {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {percent}%
      </div>
    </div>
  )
}
 export default CircularProgress;