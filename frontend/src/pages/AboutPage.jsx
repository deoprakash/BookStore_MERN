import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import About from '../components/about'
import Footer from '../components/Footer'

const AboutPage = () => {

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <>
        <Navbar />
        <About />
        <Footer />
    </>
  )
}

export default AboutPage