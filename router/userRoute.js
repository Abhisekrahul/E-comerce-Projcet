import express from 'express';
import { UpdateProfileController, getUserProfileController, loginController, logoutController, resetPasswordController, updatePasswordController, updatePhotoController, userController } from '../controller/userController.js';
import  {isAdmin, isAuth}  from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/multer.js';


const router = express.Router();

router.post('/register',isAuth,userController)
router.post('/login',loginController);
router.get('/profile',isAuth ,getUserProfileController);
router.get('/logout',isAuth,logoutController);
router.put('/update',isAuth,isAdmin,UpdateProfileController);
router.put('/update-password',isAuth,isAdmin,updatePasswordController);
router.put('/update-photo',singleUpload,updatePhotoController);
router.post('/rest-poassword',resetPasswordController)



export default router;
