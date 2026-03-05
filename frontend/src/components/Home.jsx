function Home() {
  return (
    <div className=" flex flex-col sm:flex-row justify-end">
       <div className="sm:h-screen sm:w-[50%] w-[100%] flex flex-col px-2 mb-10  sm:mb-0 sm:mx-10 mt-10 sm:mt-26">
          <p className="text-6xl black font-bold mb-4">Meet NutriTrack</p>
          <p className="text-5xl mb-4">Track your calories<br></br>
           with just a picture</p>
           <p className="text-xl mb-4">
            Meet NutriTrack, the AI-powered app for easy calorie tracking. Snap a photo, scan a barcode, or describe your meal and get instant calorie and nutrient info
           </p>
<button className="text-white bg-black px-2 py-3 rounded-lg w-[250px] h-11">Upload Images</button>
      </div>
      <div className="h-screen sm:w-[50%] w-[100%]">
        <img className="sm:h-[90%] sm:w-full" src="https://res.cloudinary.com/dddmddgzs/image/upload/v1772681688/hero-image_yy60gz.webp" alt="" srcset="" />
      </div>
     
     
    </div>
  )
}

export default Home