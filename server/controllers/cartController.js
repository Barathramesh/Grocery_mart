import User from "../models/User.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        
        // Get userId from authenticated user (via auth middleware)
        const userId = req.user._id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        return res.json({ 
            success: true, 
            message: "Cart Updated",
            user: updatedUser
        });

    } catch (error) {
        console.error("Cart update error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};