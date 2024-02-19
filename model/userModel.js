import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import  Jwt  from "jsonwebtoken";
const userSchema = new Schema({
    name:{
        type:String,
        require:[true,'name is require']
    },
    email:{
        type:String,
        require:[true,'email is reqiure'],
        unique:[true,'email is alreay taken']
    },
    password:{
        type:String,
        require:[true,'password is reqiure'],
        midLength:[6,'password length should be greter than 6 charecters']
    },
    address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "city name is required"],
      },
      country: {
        type: String,
        required: [true, "country name is required"],
      },
      phone: {
        type: String,
        required: [true, "phone no is required"],
      },
      answer:{
        type:String,
        required:[true,"Answer is required.."]
      },
      profilePic:{
        public_id :{
          type:String
        },

        url:{
          type:String
        }
      },
      role:{
        type:String,
        default:"user" 
      }
    

},
{timestamps:true})

//hash function bcrypt
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,10)
})
// decrypt fuction
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//jwt token
userSchema.methods.generateToken = function(){
  return Jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"300d"})
}



export const User = mongoose.model('User',userSchema);
export default User;