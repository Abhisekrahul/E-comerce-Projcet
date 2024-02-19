import  Jwt  from "jsonwebtoken";
import  User  from "../model/userModel.js";

//User Auth
export const isAuth = async (req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        return res.status(401).send({
            success:false,
            message:"unAutherized User"
        })
    }

    const decodeData = Jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodeData._id);
    next();
}

//Is Admin Auth

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "admin only",
      });
    }
    next();
  };