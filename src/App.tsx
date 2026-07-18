
import ImageCarousel from './components/carousel/Imagecarousel';
import Navbar from './components/navbar/Navbar'
import Collection from './components/collection/Collection'
import Exhibitions from './components/exhibitions/Exhibitions'

import './App.css'

function App() {
  
  return (
        <>
        <Navbar/>
        <ImageCarousel autoPlay={true} />
        <Collection/>
        <Exhibitions/>
        </>
  )
}

export default App
