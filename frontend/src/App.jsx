import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import BookPage from "./pages/BookPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrdersPage";
import PublishPage from "./pages/PublishPage";
import AuthorsPage from "./pages/AuthorsPage";
import AuthorDetailsPage from "./pages/AuthorDetailsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/payment' element={<PaymentPage />} />
      <Route path='/orders' element={<OrdersPage />} />
      <Route path='/order/:id' element={<OrderDetailsPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/books' element={<BookPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/publish' element={<PublishPage />} />
      <Route path='/authors' element={<AuthorsPage />} />
      <Route path='/author/:id' element={<AuthorDetailsPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App;