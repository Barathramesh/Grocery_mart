import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './route/userRoute.js';
import sellerRouter from './route/sellerRoute.js';
import productRouter from './route/productRoute.js';
import addressRouter from './route/addressRoute.js';
import orderRouter from './route/orderRoute.js';
import cartRouter from './route/cartRoute.js';

const app = express();
const port = process.env.PORT || 3000;

await connectDB()
await connectCloudinary()

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', '']


// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})