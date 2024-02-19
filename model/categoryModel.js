import mongoose, { Schema } from "mongoose";

const categorySchemas = new Schema({
    category: {
        type: String,
        required: [true, "category  is required"],
      },
    },{ timestamps: true });



export const categoryModels = mongoose.model('Category',categorySchemas);