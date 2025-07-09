import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const {userId, address} = req.body;
        if (!req.body || !req.body.userId || !req.body.address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId and address"
            });
        }
    
        const newAddress = await Address.create(
            {userId,
            ...address})
        res.json({success: true, message : "Address added successfully",address: newAddress});
    } catch (error) {
         console.log("Add Address failed:", error.message);
         res.json({success: false, message: error.message});
    }
}

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const {userId} = req.query;
        const addresses = await Address.find({userId});
        res.json({success: true, addresses });
    } catch (error) {
        console.log("Get Address failed:", error.message);
        res.json({success: false, message: error.message});
    }
}
