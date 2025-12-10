import React from 'react'
import Login from './pages/Authentication/Login.jsx'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Authentication/Register.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import HomeFeed from './pages/Home/HomeFeed.jsx'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />


      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<HomeFeed />} />
      </Route>
    </Routes>
  )
}

export default App