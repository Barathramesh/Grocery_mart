import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const SellerLogin = () => {

  const {setIsSeller, isSeller, navigate} = useAppContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSeller(true);
  }

  useEffect (()=>{
    if(isSeller) {
        navigate("/seller")
    }
  },[isSeller])


  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex-items-center justify-center pt-40 text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-6 py-8 max-w-sm
        rounded-lg shadow-xl border border-gray-200'>
            <p className='text-xl font-medium m-auto'><span className="text-primary">Seller</span> Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=> setEmail(e.target.value)} value = {email} 
                type="email" placeholder='Enter your email' 
                className='border border-gray-200 rounded w-full px-3 py-1.5 text-sm mt-1 outline-primary' required/>
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=> setPassword(e.target.value)} value = {password}
                 type="password" placeholder='Enter your password' 
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />
            </div>
            <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'>
                Login
            </button>
        </div>
         
    </form>
  )
}

export default SellerLogin
