import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import InterestTest from "./pages/InterestTest";
import FeedPage from "./pages/FeedPage";
import Trending from "./pages/Trending";
import Favorites from "./pages/Favorites";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";;
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/interest-test" element={<InterestTest />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
