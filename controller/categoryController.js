import { categoryModels } from "../model/categoryModel.js";
import productModel from "../model/productModel.js";

//Create Category
export const createCategoryController = async(req,res)=>{
    try {
        const {category}  = req.body;
        if(!category){
            return res.status(404).send({
                success:false,
                message:"Please Provide the Category name..."
            })
        }
        await categoryModels.create({category});
        res.status(200).send({
            success:true,
            message:`${category} category Created SucessFully...`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Create Category Api..",
            error
        })
    }
}

//Get All Category
export const getAllCategoryController = async(req,res)=>{
    try {
        const categories = await categoryModels.find({});
        res.status(200).send({
            success:true,
            message:" Category fetch Successfully..",
            totalCat :categories.length,
            categories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Get Category Api"
        })
    }
}

//Delete Category

export const deleteCategoryController = async (req, res) => {
    try {
      // find category
      const category = await categoryModels.findById(req.params.id);
      //validation
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Category not found",
        });
      }
      // find product with this category id
      const products = await productModel.find({ category: category._id });
      // update producty category
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        product.category = undefined;
        await product.save();
      }
      // save
      await category.deleteOne();
      res.status(200).send({
        success: true,
        message: "Catgeory Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      // cast error ||  OBJECT ID
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Id",
        });
      }
      res.status(500).send({
        success: false,
        message: "Error In DELETE CAT API",
        error,
      });
    }
  };

  //Update Category

  export const updateCategoryController = async(req,res)=>{
    try {
        // find category
        const category = await categoryModels.findById(req.params.id);
        //validation
        if (!category) {
          return res.status(404).send({
            success: false,
            message: "Category not found",
          });
        }
        const {UpdateCategory} = req.body;
        // find product with this category id
        const products = await productModel.find({ category: category._id });
        // update producty category
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          product.category = UpdateCategory;
          await product.save();
        }
        if(UpdateCategory)category.category = UpdateCategory;
        // save
        await category.save();
        res.status(200).send({
          success: true,
          message: "Catgeory Updated Successfully......",
        });
      } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
          return res.status(500).send({
            success: false,
            message: "Invalid Id",
          });
        }
        res.status(500).send({
          success: false,
          message: "Error In Update CAT API",
          error,
        });
      }
    };
  
  