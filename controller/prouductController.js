import productModel from "../model/productModel.js";
import cloudinary from 'cloudinary';
import  getDataUri  from "../utils/feature.js";


export const getAllProductController = async(req,res)=>{
    try {
        const products = await productModel.find({});
        res.status(200).send({
            success:true,
            message:'All product fetch Successfully',
            products
        }) 
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in get all products",
            error
        })
    }
}
// create Product
export const createProductController = async(req,res)=>{
    try {
        const { name, description, price, category, stock } = req.body;
    // if (!name || !description || !price || !stock) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please Provide all fields",
    //   });
    // }
    if(!req.file){
        return res.status(500).send({
            success:true,
            message:"Please Provide the Product images"
        })
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image ={
        public_id:cdb.public_id,
        url:cdb.secure_url
    }  
    await productModel.create({
        name,description,price,category,stock,images:[image]   
    })
    res.status(200).send({
        success:true,
        message:"Product Created Successfully"
    })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in create Product",
            error
        })
    }
}

//UPDATE PRODUCTS
export const updateProductController = async (req, res) => {
    try {
      // find product
      const product = await productModel.findById(req.params.id);
      //valdiatiuon
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
      const { name, description, price, stock, category } = req.body;
      // validate and update
      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (stock) product.stock = stock;
      if (category) product.category = category;
  
      await product.save();
      res.status(200).send({
        success: true,
        message: "product details updated",
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
        message: "Error In Get UPDATE Products API",
        error,
      });
    }
  };

  //UPADTE IMAGE PRODUCT

  export const updateProductImageController = async (req, res) => {
    try {
      // find product
      const product = await productModel.findById(req.params.id);
      // valdiation
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
      // check file
      if (!req.file) {
        return res.status(404).send({
          success: false,
          message: "Product image not found",
        });
      }
  
      const file = getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };
      // save
      product.images.push(image);
      await product.save();
      res.status(200).send({
        success: true,
        message: "product image updated",
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
        message: "Error In Get UPDATE Products API",
        error,
      });
    }
  };

  //Delete Product Image

  export const deleteProductIamgeController = async(req,res)=>{
    try {
      const product = await productModel.findById(req.params.id);

      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
       const id = req.query.id
       if(!id){
        return res.status(404).send({
          success: false,
          message: "Product Image not found",
        });
       }

       let isExist = -1;
       product.images.forEach((item ,index)=>{
        if(item._id.toString() === id.toString()) isExist = index
       })
       if(isExist <0){
        return res.status(404).send({
          success:false,
          message:"image not found"
        })
       }
       await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
       product.images.splice(isExist,1)
       await product.save();
       return res.status(200).send({
        success:true,
        message:"Image is deleted sucessfully..."
       })

    } catch (error) {
      console.log(error);
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Id",
        });
      }
      res.status(500).send({
        success: false,
        message: "Error In Get delete Products Iamge API",
        error,
      });
    }
  }

  // Delete Product 

  export const deleteProductController = async(req,res)=>{
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
      for(let index = 0;index<product.images.length;index++){
        await cloudinary.v2.uploader.destroy(product.images[index].public_id)
      }
      await product.deleteOne();
      return res.status(200).send({
        success:true,
        message:"Product is deleted sucessfully..."
       })
    } catch (error) {
      console.log(error);
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Id",
        });
      }
      res.status(500).send({
        success: false,
        message: "Error In delete Products  API",
        error,
      });
    }
  }

  //Product Review Controller

  export const reviewProductController = async(req,res)=>{
    try {
      const { comment, rating } = req.body;
      // find product
      const product = await productModel.findById(req.params.id);
      // check previous review
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).send({
          success: false,
          message: "Product Alredy Reviewed",
        });
      }
      // review object
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      // passing review object to reviews array
      product.reviews.push(review);
      // number or reviews
      product.newreviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      // save
      await product.save();
      res.status(200).send({
        success: true,
        message: "Review Added!",
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
        message: "Error In Review Comment API",
        error,
      });
    }
  }
  