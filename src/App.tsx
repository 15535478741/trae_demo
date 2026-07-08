import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Result } from "@/pages/Result";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div className="min-h-screen">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}