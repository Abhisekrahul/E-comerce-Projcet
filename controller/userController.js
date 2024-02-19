import orderModels from "../model/orderModel.js";
import { User } from "../model/userModel.js";
import  {getdataUri}  from "../utils/feature.js";
import cloudinary from 'cloudinary'


// register

export const userController = async (req, res) => {
    try {
      const { name, email, password, address, city, country, phone,answer } =
        req.body;
      // validation
      if (
        !name ||
        !email ||
        !password ||
        !city ||
        !address ||
        !country ||
        !phone ||
        !answer
      ) {
        return res.status(500).send({
          success: false,
          message: "Please Provide All Fields",
        });
      }
      //check exisiting user
      const exisitingUSer = await User.findOne({ email });
      //validation
      if (exisitingUSer) {
        return res.status(500).send({
          success: false,
          message: "email already taken",
        });
      }
      const user = await User.create({
        name,
        email,
        password,
        address,
        city,
        country,
        phone,
        answer
      });
      res.status(201).send({
        success: true,
        message: "Registeration Success, please login",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Register API",
        error,
      });
    }
  };

  //LOGIN

  export const loginController = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:'please add Email or Password'
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(500).send({
                success:false,
                message:"user email not found"
            })
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:"user Password not found",
            })
        }
        //token
        const token = user.generateToken();

        res.status(200).cookie("token",token,{
          expires:new Date(Date.now()+30*24*60*60*1000),
          secure:process.env.NODE_ENV === 'devlopmet' ? true:false,
          httpOnly:process.env.NODE_ENV === 'devlopmet' ? true:false
        })
          .send({
            success:true,
            message:"Login sucessfully",
            token,
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login Api",
            error
        })
    }
  }

  //Get user profile

  export const getUserProfileController = async(req,res)=>{
    try {
      const user = await User.findById(req.user._id);
      user.password = undefined;
      res.status(200).send({
        success:true,
        message:"User Profile Fetch SuccessFully",
        user
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in profile API",
        error
      })
    }
  }
  
  //Logout
  export const logoutController = async(req,res)=>{
    try {
      res.status(200).cookie('token',"",{
        expires:new Date(Date.now()+15*24*60*60*1000),
        secure:process.env.NODE_ENV === 'devlopmet' ? true:false,
        httpOnly:process.env.NODE_ENV === 'devlopmet' ? true:false
      }).send({
        success:true,
        message:"LogOut Successfully"
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in logout API",
        error
      })
    }

  }

  //Update

  export const UpdateProfileController = async(req,res)=>{
    try {
      const user = await User.findById(req.user._id);
      const {name,email,address,city,country,phone} = req.body;

      if(name) user.name = name;
      if(email) user.email = email;
      if(address) user.address = address;
      if(city) user.city = city;
      if(country) user.country = country;
      if(phone) user.phone = phone;

      await user.save()
      res.status(200).send({
        success:true,
        message:"User Profile Update SuccessFully",
        user
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in update API",
        error
      })
    }
  }

  //Update User Password

  export const updatePasswordController = async(req,res)=>{
    try {
      const user = await User.findById(req.user._id);
      const {oldPassword,newPassword} = req.body
      if(!oldPassword || !newPassword){
        return res.status(500).send({
          success:false,
          message:"Please Provide od or new Password",
        })
      }
      //old password cheack
      const isMatch = await user.comparePassword(oldPassword);
      if(!isMatch){
        return res.status(500).send({
          success:false,
          message:"invalid Old Password",
        })
      }
      user.password = newPassword
      await user.save();
      res.status(200).send({
        success:true,
        message:"Password updted successfully",
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in update Password API",
        error
      })
    }
  }

  // Update Profile photo
  export const updatePhotoController = async(req,res)=>{
    try {
      const user = await User.findById(req.user._id);
      const file = getdataUri(req.file);
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id )
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      user.profilePic ={
        public_id :cdb.public_id,
        url:cdb.secure_url
      }
      await user.save()
      res.status(200).send({
        success:true,
        message:" Profile Picture Updated",
        user
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in update Photo API",
        error
      })
      
    }
  }

  // Rest Password

export const resetPasswordController = async (req,res)=>{
  try {
    const {email,newPassword,answer} = req.body;
    if(!email || !newPassword || !answer){
      return req.status(500).send({
        success:false,
        message:"please Povide all fields..."
      })
    }

    const user = await User.findOne({email,answer});
    if(!user){
      return res.status(404).send({
        success:false,
        message:"invalid user or answer"
      })
    }
    user.password = newPassword
    await user.save();
    res.status(200).send({
      success:true,
      message:"Your password has been reset please login ..."
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in Password reset  API",
      error
    })
  }
}

