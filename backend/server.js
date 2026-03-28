const express = require("express");
const cors = require("cors");
const NutritionRoutes = require("./routes/NutritionRoutes")
const app = express();
// app.use(express.json());

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api",NutritionRoutes)
app.post("/",(req,res)=>{
res.send('i am active')
});

const port = 3000;
app.listen(port,()=>{
    console.log("server running on ",port);
})