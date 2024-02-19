import  orderModels  from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import { strip } from "../server.js";


//Create Order
export const createOrderController = async (req,res)=>{
    try {
        const {
          shippingInfo,
          orderItems,
          paymentMethod,
          paymentInfo,
          itemPrice,
          tax,
          shippingCharges,
          totalAmount,
        } = req.body;
        //valdiation
        // create order
        await orderModels.create({
          user:req.user._id,
          shippingInfo,
          orderItems,
          paymentMethod,
          paymentInfo,
          itemPrice,
          tax,
          shippingCharges,
          totalAmount,
        });
    
        // stock update
        for (let i = 0; i < orderItems.length; i++) {
          // find product
          const product = await productModel.findById(orderItems[i].product);
          product.stock -= orderItems[i].quantity;
          await product.save();
        }
        res.status(201).send({
          success: true,
          message: "Order Placed Successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Create Order API",
          error,
        });
      }
    };

    //GET ORDER ALL
    export const getMyOrderController = async(req,res)=>{
      try {
        const orders = await orderModels.find({user:req.user._id})
        if(!orders){
          return res.status(404).send({
            success:false,
            message:"No Order Found"
          })
        }
        res.status(201).send({
          success:true,
          message:"Your order data",
          totalOrder : orders.length,
          orders
        })
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In  My Order API",
          error,
        });
      }
    }

    //GET SINGLE ORDER DETAILS

    export const singleOrderDetrailsController = async (req, res) => {
      try {
        // find orders
        const order = await orderModels.findById(req.params.id);
        //valdiation
        if (!order) {
          return res.status(404).send({
            success: false,
            message: "no order found",
          });
        }
        res.status(200).send({
          success: true,
          message: "your order fetched",
          order,
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

    // Accept Payment 
    export const acceptPaymentController = async(req,res)=>{
      try {
        const {totalAmount} = req.body;
        if(!totalAmount){
          return res.status(404).send({
            success:false,
            message:"Total amount is require.."
          })
        }
        const {client_secret} =await strip.paymentIntents.create({
          amount:Number(totalAmount*100),
          currency:"inr"
        })
        res.status(200).send({
          success:true,
          message:"sucessfully payment...."
        })
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Get UPDATE Products API",
          error,
        });
      }
    }

      //    ADMIN SECTION ///

// Get  ALL Order
export const getAllOrderController = async (req,res)=>{
  try {
    const order = await orderModels.find({});
    res.status(200).send({
      success:true,
      message:"All Orders data",
      totalOrder: order.length,
      order
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

//CHANGE ORDER STATUS

export const changeOrderStatus = async (req,res)=>{
  try {
    const order = await orderModels.findById(req.params.id);
    if(!order){
      return res.status(404).send({
        success:false,
        message:"Order Not Found..."
      })
    }
    if(order.orderStatus ==="processing") order.orderStatus = "shipped"
    else if(order.orderStatus ==="shipped"){
      order.orderStatus = "deliverd"
      order.deliverdAt = new Date();
    }else{
      return res.status(500).send({
        success:false,
        message:"Order already Deliverd.."
      })
    }
    await order.save();
    res.status(200).send({
      success:true,
      message:"Order Updated Successfully...."
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
      message: "Error In Update Order API",
      error,
    });
  }
}