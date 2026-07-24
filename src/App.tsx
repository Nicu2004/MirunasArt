import { Routes, Route } from 'react-router-dom';
import ImageCarousel from './components/carousel/Imagecarousel';
import Navbar from './components/navbar/Navbar';
import Collection from './components/collection/Collection';
import Exhibitions from './components/exhibitions/Exhibitions';
import ArtistSection from './components/artistsection/Artistsection';
import AuthPage from './components/authpage/Authpage';
import Profile from './components/profile/Profile';
import ProtectedRoute from './components/security/ProtectedRoutes';
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
function ProfileSection() {
  return <>
   <Navbar />
    <Profile/>
  </>
  
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfileSection/></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;