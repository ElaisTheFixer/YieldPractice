import React from 'react'
import { useEffect, useState } from 'react'
import styles from './style.js'
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "./components";
import { Routes, Route, useNavigate } from 'react-router-dom'
import Homepage  from './pages/Homepage.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  <Routes>
    <Route path='/' element={<Homepage/>}/>
    <Route path='dashboard' element={<Dashboard/>}/>
    <Route path='features' element={<Business/>}/>
  </Routes>
};

export default App