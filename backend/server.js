const express = require("express");
const cors = require("cors");
const NutritionRoutes = require("./routes/NutritionRoutes");
const UserRoutes = require("./routes/UserRoutes");
const MealRoutes = require("./routes/MealRoutes");
const app = express();
const connectDB = require("./config/db")
// app.use(express.json());

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use("/api",NutritionRoutes);
app.use("/user",UserRoutes);
app.use("/meals",MealRoutes);
app.get("/",(req,res)=>{
res.send('i am active')
});

connectDB();

const port = 3000;
app.listen(port,()=>{
    console.log("server running on ",port);
})