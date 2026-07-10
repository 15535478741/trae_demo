import { Shield, User, LogOut, Home, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

export function Header() {
  const { isAuthenticated, signOut } = useAuthStore();
  const { theme, colorMode, toggleColorMode } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentTheme = themes[theme];
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const isHome = location.pathname === '/';
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300"
      style={{ backgroundColor: currentTheme.primary }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Shield className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">资料核验</h1>
        </div>
        
        <nav className="flex items-center gap-4">
          <button
            onClick={toggleColorMode}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            title={colorMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {colorMode === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              {!isHome && (
                <button
                  onClick={() => navigate('/')}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">首页</span>
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">个人中心</span>
              </button>
              <button
                onClick={handleSignOut}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">退出</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-white/80 hover:text-white transition-colors"
              >
                登录
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 px-4 py-1.5 rounded-full font-medium hover:bg-blue-50 transition-colors"
              >
                注册
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}