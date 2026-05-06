const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
name:{type:String,trim:true, required:true},
email:{type:String, required:true , unique:true ,trim:true,match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]},
password:{type:String, required:true,minLength:6},
 age: { type: Number , required:true },
  gender: { type: String,required:true, enum: ["male", "female", "other"] },
  height: { type: Number ,required:true}, // in cm
  weight: { type: Number ,required:true}, // current weight (kg)

  // 🎯 Goals
  goal: { 
    type: String, 
    enum: ["lose_weight", "gain_weight", "maintain_weight","track_only"],
    default:"track_only" 
  },
  targetWeight: { type: Number }, // kg
  dailyCalorieGoal: { type: Number }, // kcal
  activityLevel: {
  type: String,
  enum: ["sedentary", "light", "moderate", "active"],
  required: true
}

  // ⚙️ System
//   createdAt: { type: Date, default: Date.now }
},
{timestamps:true}
)

// middelware for password hashing
userSchema.pre("save", async function (){
if(!this.isModified("password")) return ;
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt);
// next();
})

// middelware for password comapring with hash password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}
const User = mongoose.model("User",userSchema);

module.exports = User;