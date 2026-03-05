const express = require("express");
const NutritionRoutes = require("./routes/NutritionRoutes")
const app = express();
app.use("/",NutritionRoutes)
app.post("/",(req,res)=>{
res.send('i am active')
});
const port = 3000;
app.listen(port,()=>{
    console.log("server running on ",port);
})