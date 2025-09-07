import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import BookPage from "./pages/BookPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import Login from "./components/Login";
import Signup from "./assets/dummystyles";

const App = () => {
  return (
    <Routes>
      <Route path = '/' element = {<Home />} />
      <Route path = '/cart' element = {<CartPage />} />
      <Route path = '/about' element = {<AboutPage />} />
      <Route path = '/books' element = {<BookPage />} />
      <Route path = '/books' element = {<ContactPage />} />

      <Route path = '/login' element = {<Login />} />
      <Route path = '/signup' element = {<Signup />} />


      
    </Routes>
  )
}

export default App;