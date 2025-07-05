import { createContext, useContext, useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

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

    const fetchSeller = async () => {
    try {
        // const sellerToken = localStorage.getItem('sellerToken');
        // if (!sellerToken) {
        //     setIsSeller(false);
        //     return;
        // }
        const { data } = await axios.get('/api/seller/is-auth');
        if (data.success) {
            setIsSeller(true);
        } else {
            setIsSeller(false);
            //localStorage.removeItem('sellerToken');
        }
    } catch (error) {
        setIsSeller(false);
    }
    };
    
    const fetchuser = async () => {
        try {
            const userToken = localStorage.getItem('userToken');
            if (!userToken) {
                setUser(null);
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
    };

    const fetchProducts = async () => {
       try {
        const {data} = await axios.get('/api/product/list');
        if(data.success) {
            setProducts(data.products)
        } else {
            toast.error(data.message);
        }
       } catch (error) {
          toast.error(error.message);
       }
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
        fetchuser()
        fetchSeller()
        fetchProducts()
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
        getcartcount,
        axios,
        fetchProducts
    };

    return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};