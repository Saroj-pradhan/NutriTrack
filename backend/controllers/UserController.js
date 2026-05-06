import User from "../model/User.js";
import jwt from 'jsonwebtoken';
export async function userSignup(req, res){
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      goal,
      targetWeight,
      activityLevel
    } = req.body;

    // 🔴 1. Basic validation
    if (
      !name || !email || !password ||
      !age || !gender || !height || !weight || !activityLevel
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // 🔴 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

  let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

   const activityMap = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725
};

let activityMultiplier = activityMap[activityLevel];
    

    const tdee = Math.round(bmr * activityMultiplier);
     let dailyCalorieGoal = Number(tdee);

    if (goal === "lose_weight") {
      dailyCalorieGoal = tdee - 500;
    } else if (goal === "gain_weight") {
      dailyCalorieGoal = tdee + 300;
    } else if (goal === "maintain_weight") {
      dailyCalorieGoal = tdee;
    }else{
        dailyCalorieGoal = 0;
    }

    // // ⚠️ Safety limits
    if (gender === "female" && dailyCalorieGoal < 1200) {
      dailyCalorieGoal = 1200;
    }
    if (gender === "male" && dailyCalorieGoal < 1500) {
      dailyCalorieGoal = 1500;
    }
    if (goal === "track_only") {
      dailyCalorieGoal = 0;
    }
    // ✅ 4. Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      goal,
      targetWeight,
      dailyCalorieGoal,
      activityLevel
    });

    // 🔐 5. Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    
    });
  }
};

export async function userLogin(req, res){
    try {
        const { email, password } = req.body;
console.log(email,password);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }
console.log("pass1");
        const user = await User.findOne({ email });
console.log("pass2");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials user not found"
            });
        }
console.log("pass3");
        //  Password verificaion/matching
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

console.log("pass4");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log("pass5");
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        })
        
    }
}
