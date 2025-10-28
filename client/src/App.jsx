import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateRoom from './pages/CreateRoom';
import JoinRoom from "./pages/JoinRoom";
import WaitingRoom from "./pages/WaitingRoom";
import GameRoom from "./pages/GameRoom";
import Profile from "./pages/Profile";
import HowToPlay from "./pages/HowToPlay";
import HomePage from './pages/HomePage';
import AboutDev from './pages/AboutDev';
import TipTheDev from './pages/TipTheDev';
import SoundToggle from './components/common/SoundToggle';
import Damage  from "./pages/damage";

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <InnerApp /> 
      </Router>
    </AuthProvider>
  );
}

// 👇 ADD this
function InnerApp() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/about" element={<AboutDev />} />
        <Route path="/construction" element={<Damage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/landing" element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        } />
        <Route path="/create-room" element={
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        } />
        <Route path="/join-room" element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        } />
        <Route path="/waiting-room" element={
          <ProtectedRoute>
            <WaitingRoom />
          </ProtectedRoute>
        } />
        <Route path="/game-room" element={
          <ProtectedRoute>
            <GameRoom />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/tip-the-dev" element={
          <ProtectedRoute>
            <TipTheDev />
          </ProtectedRoute>
        } />
         

      </Routes>
      
      {/* Global Sound Toggle */}
      <SoundToggle />
    </>
  );
}

export default App;
