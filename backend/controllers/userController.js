
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Optional: Set expiration
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Passwords match, generate token
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Generate token
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin credentials are correct
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate a token for admin
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin }








// import jwt from "jsonwebtoken";
// import validator from "validator";
// import bcrypt from "bcrypt";
// import userModel from "../models/userModel.js";
// import { response } from "express";


// const createToken = (id) => {
//     return jwt.sign({id},process.env.JWT_SECRET)
// }




// // route for user login
// const loginUser = async (req,res) => {
//  try {
//     const {email,password} = req.body;

//     const user = await userModel.findOne({email});

//     if (!user) {
//         return res.json({succes:false, message:"User doesn't exists"})
//     }
//      const isMatch = await bcrypt.compare(password,user.password)

//      if (!isMatch) {
//         const token = createToken(user._id)
//         res.json({succes:true,token})
//      }
//      else{
//         res.json({succes:false,message:"Invalid Credentials"})
//      }
//  } catch (error) {
//     console.log(error);
//     res.json({succes:false,message:error.message})
//  }
// }


// // route for user registration
// const registerUser = async (req,res)=>{
//  try {
//     const {name,email,password} = req.body;

//     // checking user already exist or not
//     const exists = await userModel.findOne({email});
//     if (exists) {
//         return res.json({succes:false, message:"User already exists"})
//     }
//     //  validating email format and strong password
//     if (!validator.isEmail(email)) {
//         return res.json({succes:false, message:"Please enter a valid email"})
//     }
//     if (password.length < 8) {
//         return res.json({succes:false, message:"Please enter a strong password"})
//     }

// // hashing user password
// const salt = await bcrypt.genSalt(10)
// const hashedPassword = await bcrypt.hash(password,salt)

//  const newUser = new userModel({
//     name,
//     email,
//     password:hashedPassword
//  })

//  const user = await newUser.save()

//  const token = createToken(user._id)

//  res.json({succes:true,token})


//  } catch (error) {
//     console.log(error);
//     res.json({succes:false,message:error.message})
//  }
// }

// // route for admin login
// const adminLogin = async (req,res) =>{
//    try {
//     const {email,password} = req.body

//     if (email=== process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//         const token = jwt.sign(email+password,process.env.JWT_SECRET);
//         res.json({success:true,token})
//     }else{
//         res.json({success:false,message:"Invalid cedentials"})
//     }
//    } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
//    }
// }

// export { loginUser, registerUser, adminLogin}