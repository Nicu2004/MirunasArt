import { Routes, Route } from 'react-router-dom';
import ImageCarousel from './components/carousel/Imagecarousel';
import Navbar from './components/navbar/Navbar';
import Collection from './components/collection/Collection';
import Exhibitions from './components/exhibitions/Exhibitions';
import ArtistSection from './components/artistsection/Artistsection';
import AuthPage from './components/authpage/Authpage';
import './App.css';

function HomePage() {
  return (
    <>
      <Navbar />
      <ImageCarousel autoPlay={true} />
      <Collection />
      <Exhibitions />
      <ArtistSection />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;