import express from 'express';
import { getAllOrders, getUserOrders, placeOrderCOD} from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';
import authSeller from '../middleware/authSeller.js';


const orderRouter = express.Router();

orderRouter.post('/cod',authUser , placeOrderCOD)
orderRouter.get('/user',authUser , getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)


export default orderRouter