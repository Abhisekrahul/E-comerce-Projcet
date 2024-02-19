import express from 'express';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';
import { createProductController, deleteProductController, deleteProductIamgeController, getAllProductController, reviewProductController, updateProductController, updateProductImageController } from '../controller/prouductController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

// Get all product
router.get('/get-all',getAllProductController)

//create Prouduct
router.post('/create',isAuth,singleUpload,createProductController)

//update Product
router.put('/:id',updateProductController);

//Update Image
router.put('/image/:id',singleUpload,updateProductImageController)

//Delte Image
router.delete('/delete-img/:id',deleteProductIamgeController)

// Delete Product
router.delete('/delete/:id',deleteProductController) 

//Review Product
router.put('/:id/review',isAuth,reviewProductController);
export default router;