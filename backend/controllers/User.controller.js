import User from "../models/User.model.js";
import ResumeMatch from "../models/ResumeMatch.model.js";
import MatchResult from "../models/MatchResult.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const registerUser=async(req,res)=>{
    try{
        const {name,email,phoneNumber,password}=req.body;
        if(!name || !email || !phoneNumber ||!password ){
            return res.status(400).json({
                message:"Something is missing.",
                success:false
            });
        };
        const user=await User.findOne({email}); //checks whether the user already exists or not
        if(user){
            return res.status(400).json({
                message:'User already exist with this email.',
                success:false,
            })
        }
        const hashedPassword=await bcrypt.hash(password,10) //kitni length ka passowrd hona chahiye

        await User.create({
            name,
            email,
            phoneNumber,
            password:hashedPassword,
        });

        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        });
    }
    catch(error){
        console.log(error)
    }
}


export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password ){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                message:"Incorrect email or Password",
                success:false
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or Password",
                success:false
            })
        };
        const tokenData={
            userId:user._id
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})

        user={
            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber
        }

        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly:true,secure: true,sameSite:'None'}).json({
            message:`Welcome back ${user.name}`,
            user,
            success:true
        })
    }
    catch(error){
        console.log(error)
    }
}

// GET USER
export const getUser = async (req,res)=>{
  const user = await User.findById(req.userId).populate("history");
  res.json(user);
};


export const logoutUser = async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true,
                sameSite: "lax",       // or "none" if using cross-origin with credentials
                secure: false          // true in production (HTTPS)
            })
            .json({
                message: "Logged out successfully",
                success: true
            });
    } catch (error) {
        console.log(error);
    }
};

// HISTORY
export const getHistory = async (req, res) => {
  try {
    // const user = await User.findById(req.id).populate("history");
    const user = await User.findById(req.id)
  .populate({
    path: "history",
    populate: { path: "matchResultId" }
  });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.history || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MATCH DETAILS
export const getMatchDetails = async (req,res)=>{
  const { matchId } = req.params;

  const match = await ResumeMatch.findById(matchId).populate("matchResultId");
  res.json(match);
};
