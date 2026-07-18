
import ImageCarousel from './components/carousel/Imagecarousel';
import Navbar from './components/navbar/Navbar'
import Collection from './components/collection/Collection'

import './App.css'

function App() {
  
  return (
        <>
        <Navbar/>
        <ImageCarousel autoPlay={true} />
        <Collection/>
        </>
  )
}

export default App
