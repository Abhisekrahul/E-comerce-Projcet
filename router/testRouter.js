import express from 'express';
import { testController } from '../controller/testController.js';

//router Object
const router = express.Router();

//Routes
router.get('/',testController)


//exort
export default router;