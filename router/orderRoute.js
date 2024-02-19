import express from 'express';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';
import { acceptPaymentController, changeOrderStatus, createOrderController, getAllOrderController, getMyOrderController, singleOrderDetrailsController } from '../controller/orderController.js';
;

const router = express.Router();

//create order
router.post('/creates',isAuth,createOrderController)

//Get All Order
router.get('/get-order',isAuth,getMyOrderController)

//Get Single  Order
router.get('/get-order/:id',isAuth,singleOrderDetrailsController)

//Accept Payment
router.post('/accept-payment',isAuth ,acceptPaymentController)

//Admin
router.get('/admin/get-all-orders',isAuth,isAdmin,getAllOrderController)

//Change Order Statsus
router.put('/change/:id',isAuth,changeOrderStatus);


export default router;