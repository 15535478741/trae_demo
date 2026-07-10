import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Result } from "@/pages/Result";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { useAppStore } from "@/store/useStore";

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/login', '/register'].includes(location.pathname);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { colorMode } = useAppStore();
  
  useEffect(() => {
    const savedMode = localStorage.getItem('colorMode') || 'light';
    document.body.classList.toggle('dark', savedMode === 'dark');
  }, []);
  
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
    document.body.classList.toggle('dark', colorMode === 'dark');
  }, [colorMode]);
  
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (!completed && location.pathname === '/') {
      setShowOnboarding(true);
    }
  }, [location.pathname]);
  
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
      {showOnboarding && <OnboardingGuide />}
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