import React , { useEffect }  from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BestSeller from '../components/BestSeller'
import Homebooks from '../components/Homebooks'
import HomeAbout from '../components/HomeAbout'
import Footer from '../components/Footer'

const Home = () => {

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);
  
  return (
    <>
        <Navbar />
        <Banner/>
        <BestSeller />
        <Homebooks />
        <HomeAbout />
        <Footer />
    </>
  )
}

export default Home