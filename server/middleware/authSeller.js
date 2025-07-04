import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    
    const {sellertoken} = req.cookies;
   
    if (!sellertoken) {
        console.log('No token found in request');
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        });
    }

    try {
        const tokendecode = jwt.verify(sellertoken, process.env.JWT_SECRET)
        if (tokendecode.email === process.env.SELLER_EMAIL) {
            next();
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export default authSeller;