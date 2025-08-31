import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BestSeller from '../components/BestSeller'

const Home = () => {
  return (
    <>
        <Navbar />
        <Banner/>
        <BestSeller />
    </>
  )
}

export default Home