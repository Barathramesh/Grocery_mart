import jwt from 'jsonwebtoken'; 


//Login seller : /api/seller/login
export const sellerlogin = async (req, res)=>{

    try {
        const {email, password} = req.body;
        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('sellertoken',token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            return res.status(201).json({success: true, message: "Logged in"});
        }
    } catch (error) {
         console.error("Login error: ",error.message);
         return res.status(500).json({success: false, message: error.message});
    }
}


//Check Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async(req, res) => {
    try {
        return res.json({success:true});
    } catch (error) {
        console.error("Authentication error: ",error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}

//Seller Logout : /api/seller/logout
export const sellerlogout = async(req, res) => {
    try {
        res.clearCookie('sellertoken',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        });
        return res.json({success:true, message: "Logged Out"});
    } catch (error) {
        console.error("Logout error: ",error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}