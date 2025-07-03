import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.js';

// Add Product :/api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files;

        let imagesurl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                 {resource_type: 'image'});
                 return result.secure_url;
            }
        ))

        await Product.create({...productData, image: imagesurl});
        return res.json({success: true, message: 'Product added successfully'});

    } catch (error) {
        console.log("Add Product error: ", error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}

// Get Product :/api/product/list
export const productlist = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json({success: true, products});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}

// Get single Product :/api/product/id
export const productById= async (req, res) => {
    try {
        const {id} = req.body;
        const product = await Product.findById(id);
        return res.json({success: true, product});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: error.message})
    }
}

// Get Product inStock :/api/product/stock
export const changeStock = async (req, res) => {
        try {
            const {id, inStock} = req.body;
            await Product.findByIdAndUpdate(id, inStock)
        } catch (error) {
           console.log(error.message);
           return res.status(500).json({success: false, message: error.message})
        }
}