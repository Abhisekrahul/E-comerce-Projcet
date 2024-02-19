import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import testRoute from './router/testrouter.js'
import userRoute from './router/userRoute.js'
import productRoute from './router/productRoute.js'
import categoryRoute from './router/categoryRoute.js'
import orderRoute from './router/orderRoute.js'
import { User } from './model/userModel.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';

app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
//database conected
mongoose.connect('mongodb://0.0.0.0:27017/Ecomerce').then(() => console.log('Connected!'));

// dotenv config
dotenv.config();
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
//Strip Configuration
export const strip = new Stripe(process.env.STRIPE_SCRET_KEY);

//cloudinary config
cloudinary.v2.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_SECRET_KEY
})
//Middleware
app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.use('/',testRoute);
app.use('/',userRoute);
app.use('/',productRoute);
app.use('/',categoryRoute);
app.use('/',orderRoute);



const PORT = process.env.PORT

app.listen(PORT,()=>{

    console.log(`Server Started ${process.env.NODE_ENV} mode`);
})

