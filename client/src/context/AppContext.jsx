import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

  // Fetch Seller Status
  const fetchSeller = async ()=>{
    try {
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true)
        }else{
            setIsSeller(false)
        }
    } catch (error) {
        setIsSeller(false)
    }
  }

    // Fetch User Auth Status , User Data and Cart Items
const fetchUser = async ()=>{
    try {
            const userToken = localStorage.getItem('userToken');
            if (!userToken) {
                setUser(null);
                setCartItems({});
                return;
            }

            const { data } = await axios.get('/api/user/is-auth');

            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
                localStorage.removeItem('userToken');
            }
        } catch (error) {
            setUser(null);
        }
}



    // Fetch All Products
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

// Add Product to Cart
const addToCart = (itemId)=>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart")
}

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

// Remove Product from Cart
const removeFromCart = async (itemId) => {
    try {
        let cartData = structuredClone(cartItems);
        
        if(cartData[itemId]) {
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        
        // Update local state immediately
        setCartItems(cartData);
        toast.success("Removed from Cart");
        
        // Update server immediately for removal
        if (user) {
            await axios.post('/api/cart/update', { 
                cartItems: cartData 
            });
        }
    } catch (error) {
        toast.error("Failed to update cart");
        console.error("Cart update error:", error);
        // Optionally revert local state if server update fails
    }
}

  // Get Cart Item Count
  const getCartCount = ()=>{
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount;
  }

// Get Cart Total Amount
const getCartAmount = () =>{
    let totalAmount = 0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if(cartItems[items] > 0){
            totalAmount += itemInfo.offerPrice * cartItems[items]
        }
    }
    return Math.floor(totalAmount * 100) / 100;
}


    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    // Update Database Cart Items
    useEffect(() => {
    const updateCart = async () => {
        try {
            const { data } = await axios.post('/api/cart/update', { 
                cartItems 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!data.success) {
                toast.error(data.message);
                // Optionally revert to last known good state
                if (data.cartItems) {
                    setCartItems(data.cartItems);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update cart");
            console.error("Cart update error:", error);
        }
    };

    if (user && Object.keys(cartItems).length > 0) {
        const timer = setTimeout(updateCart, 500); // Debounce
        return () => clearTimeout(timer);
    }
}, [cartItems, user]);

    const value = {navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, 
        cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount,
         axios, fetchProducts, setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
