import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY ;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);

    const [cartItems, setCartItems] = useState({}); 
    const [searchQuery, setsearchQuery] = useState({});

    const fetchProducts = async () => {
        setProducts(dummyProducts); 
    };

    const addToCart = (itemId) => { 
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Removed From Cart");
        setCartItems(cartData);
    };
   
    const getcartcount = () => {
        let totalcount = 0;
        for(const item in cartItems) {
            totalcount += cartItems[item];
        }
        return totalcount;
    }

    const getcartamount = () => {
        let totalamount = 0;
        for(const item in cartItems) {
           let iteminfo = products.find((product)=> product._id === item);
           if(cartItems[item] > 0) {
            totalamount += iteminfo.offerPrice * cartItems[item]
           }
        }
        return Math.floor(totalamount * 100) / 100;
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {
        navigate,
        user,
        setUser,
        setIsSeller,
        isSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItems,
        removeFromCart,
        cartItems,
        searchQuery,
        setsearchQuery,
        getcartamount,
        getcartcount
    };

    return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};