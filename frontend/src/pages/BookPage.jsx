import React, { useEffect} from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Books from '../components/Books' 

const BookPage = () => {

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);
    
  return (
    <>
      <Navbar />
      <Books />
      <Footer />
    </>
  )
}

export default BookPage