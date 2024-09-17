// import jwt from "jsonwebtoken";

// const adminAuth = async (req,res,next) => {
//     try {
//         const {token} =req.headers
//         if (!token) {
//              return res.json({success:false, message:"Not Authorized Login Again"})
//         }
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET);
//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({success:false, message:"Not Authorized Login Again"})
//         }
//         next()
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }

// export default adminAuth;


import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    // Verify the token and extract the payload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token contains an admin identifier (e.g., an email or role)
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Access denied, admin only" });
    }

    // If the token is valid and the user is an admin, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Token invalid or expired, login again" });
  }
};

export default adminAuth;
