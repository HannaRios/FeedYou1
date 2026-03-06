import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TestIntro from "./pages/TestIntro";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import InterestTest from "./pages/InterestTest";
import FeedPage from "./pages/FeedPage";
import Trending from "./pages/Trending";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import SeguidosPage from "./pages/SeguidosPage";
import ResetPassword from "./pages/ResetPassword";
import PostDetail from "./components/PostDetail";
import socket from "./socket";
import { useEffect } from "react";
import { SearchProvider } from "./context/SearchContext";
import PublicProfile from "./pages/PublicProfile";

function App() {
  useEffect(() => {
    socket.connect();
    
    socket.on("connect", () => {
      console.log("Conectado al servidor de sockets");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor de sockets");
    });
  }, []);

  return (
    <Router>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/interest-test" element={<InterestTest />} />
          <Route path="/test-intro" element={<TestIntro />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/seguidos" element={<SeguidosPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/usuario/:email" element={<PublicProfile />} />
        </Routes>
      </SearchProvider>
    </Router>
  );
}

export default App;
