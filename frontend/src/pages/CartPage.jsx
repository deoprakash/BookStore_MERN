import React, { useEffect} from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Cart from '../components/cart'

const CartPage = () => {

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);
    
  return (
    <>
        <Navbar />
        <Cart />
        <Footer />
    </>
  )
}

export default CartPage