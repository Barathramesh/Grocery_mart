import { upload } from '../configs/multer.js';
import expreess from 'express';
import { authSeller } from '../middlewares/auth.js';
import { addProduct, changeStock, productById, productlist } from '../controllers/productController.js';

const productRouter = expreess.Router();

productRouter.post('/add', upload.array([images]), authSeller, addProduct);
prodctRouter.get('/list', productlist);
prodctRouter.get('/id', productById);
prodctRouter.post('/stock', authSeller, changeStock);

export default productRouter;