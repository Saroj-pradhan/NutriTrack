

function Result() {
    const stored = localStorage.getItem("NutritionData");
    const NutritionData = stored ? JSON.parse(stored) : null;
    // const NutritionData = localStorage.getItem("NutritionData")
    console.log(NutritionData,"NutritionData,,,,,,,");
    
    if(!NutritionData.length){
        return <div>Data Not Found</div>
    }
  return (
      <div>
       { NutritionData.map((dt)=>(
        <div>
            <h1>Food Name: {dt.name}</h1>
  <h2>Calories: {dt.calories}</h2>
      <h2>Protein: {dt.protein}</h2>
      <h2>Carbs: {dt.carbs}</h2>
      <h2>Fat: {dt.fat}</h2>
      </div>
       ))}
    
      </div>
  )
}

export default Result