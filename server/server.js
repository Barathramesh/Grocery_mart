import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './route/userRoute.js';
import sellerRouter from './route/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './route/productRoute.js';
import cartRouter from './route/cartRoute.js';
import addressRouter from './route/addressRoute.js';
import orderRouter from './route/orderRoute.js';


const app = express();
const port = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

const allowedOrigin = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigin, credentials: true}));


app.get('/',(req, res)=> res.send("API is working"));
app.use('/api/user' , userRouter)
app.use('/api/seller' , sellerRouter)
app.use('/api/product' , productRouter)
app.use('/api/update' , cartRouter)
app.use('/api/address' , addressRouter)
app.use('/api/order' , orderRouter)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})