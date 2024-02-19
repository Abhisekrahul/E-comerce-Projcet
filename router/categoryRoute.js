import express from 'express';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/multer.js';
import { createCategoryController, deleteCategoryController, getAllCategoryController, updateCategoryController } from '../controller/categoryController.js';

const router = express.Router();


//create Category
router.post('/create-cate',isAuth,createCategoryController)

//Get Category
router.get('/getall-cate',getAllCategoryController);

// Delete Category
router.delete('/delete-cat/:id',deleteCategoryController);

// Update Category
router.put('/Update-cat/:id',updateCategoryController);

export default router;