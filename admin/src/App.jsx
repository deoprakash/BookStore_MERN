import React from 'react'
import SideBar from './components/SideBar.jsx'
import AddBook from './components/AddBook.jsx'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className=' flex min-h-screen bg-gray-50'>
      <SideBar />

      <main className=' flex-1 overflow-auto'>
        <Routes>
          <Route path="/" element={<AddBook />}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App