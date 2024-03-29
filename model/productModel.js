import mongoose from "mongoose";

//Review Model

const reviewSchema = new mongoose.Schema({
  name:{
    type:String,
    require:[true,"name is required"]
  },
  rating:{
    type:Number,
    default:0
  },
  comment:{
    type:String,
    require:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:[true,"User required"]
  }
},{timestamps:true});


//Product Model
const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "product name is required"],
      },
      description: {
        type: String,
        required: [true, "produvct description is required"],
      },
      price: {
        type: Number,
        required: [true, "product price is required"],
      },
      stock: {
        type: Number,
        required: [true, "product stock required"],
      },
      // quantity: {
      //   type: Number,
      //   required: [true, "product quantity required"],
      // },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      images: [
        {
          public_id: String,
          url: String,
        },
      ],
      reviews:[reviewSchema],
      rating:{
        type:Number,
        default:0
      },
      numReview:{
        type:Number,
        default:0
      }
    },
    { timestamps: true }
  );
  
  export const productModel = mongoose.model("Products", productSchema);
  export default productModel;