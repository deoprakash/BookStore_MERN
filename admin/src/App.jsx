import React from 'react'
import SideBar from './components/SideBar.jsx'
import AddBook from './components/AddBook.jsx'
import { Routes, Route } from 'react-router-dom'
import ListBook from './components/ListBook.jsx'
import EditBook from './components/EditBook.jsx'
import Orders from "./components/Orders.jsx";
import Team from "./components/Team.jsx";
import AddAuthor from "./components/AddAuthor.jsx";
import ListAuthors from "./components/ListAuthors.jsx";
import EditAuthor from "./components/EditAuthor.jsx";
import Login from "./components/Login.jsx";
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    // Add a request interceptor to include the token in all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Add a response interceptor to handle 401 Unauthorized (invalid token)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setToken(''); // Auto logout if token is invalid
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className=' flex min-h-screen bg-gray-50'>
      <SideBar />

      <main className=' flex-1 overflow-auto'>
        <Routes>
          <Route path="/" element={<AddBook />}></Route>
          <Route path='/list-books' element={<ListBook />}></Route>
          <Route path='/edit-book/:id' element={<EditBook />}></Route>
          <Route path="/orders" element={<Orders />} />
          <Route path="/team" element={<Team />} />
          <Route path="/add-author" element={<AddAuthor />} />
          <Route path="/list-authors" element={<ListAuthors />} />
          <Route path="/edit-author/:id" element={<EditAuthor />} />
        </Routes>
      </main>
    </div>
  )
}

export default App