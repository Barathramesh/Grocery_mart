import express from 'express';
import { isSellerAuth, sellerlogin, sellerlogout } from '../controllers/sellerController.js';
import authSeller from '../middleware/authSeller.js';

const sellerRouter  = express.Router();

sellerRouter.post('/login', sellerlogin);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.get('/logout', sellerlogout);

export default sellerRouter;