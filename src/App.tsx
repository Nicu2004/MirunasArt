import { useState } from 'react'
import ImageCarousel from './components/carousel/Imagecarousel';
import Navbar from './components/navbar/Navbar'

import './App.css'

function App() {
  
  return (
        <>
        <Navbar/>
        <ImageCarousel autoPlay={true} />

        </>
  )
}

export default App
