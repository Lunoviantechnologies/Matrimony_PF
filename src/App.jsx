import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
// import Footer from './components/Footer';

function App() {

  return (
    <div className="App">
      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  )
}

export default App
