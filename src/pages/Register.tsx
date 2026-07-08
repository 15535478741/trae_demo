import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

export function Register() {
  const { signUp, isAuthenticated, error, loading, clearError } = useAuthStore();
  const { theme } = useAppStore();
  const navigate = useNavigate();
  
  const currentTheme = themes[theme];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogoutAndRegister = () => {
    useAuthStore.getState().signOut();
  };
  
  useEffect(() => {
    return () => clearError();
  }, [clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setShowError(false);
    
    if (!email || !password || !confirmPassword) {
      setShowError(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }
    
    if (password.length < 6) {
      setShowError(true);
      return;
    }
    
    await signUp(email, password);
  };
  
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword;
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.primaryDark} 0%, ${currentTheme.primary} 50%, ${currentTheme.primaryLight} 100%)`
        }}
      />
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${currentTheme.primary}15` }}
            >
              <Shield className="w-8 h-8" style={{ color: currentTheme.primary }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">创建账户</h1>
            <p className="text-gray-500 mt-2">开启您的资料核验之旅</p>
          </div>
          
          {useAuthStore.getState().isAuthenticated && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 text-blue-700 mb-6">
              <Shield className="w-5 h-5" />
              <span>您当前已登录，如需注册新账户请先退出</span>
              <button
                onClick={handleLogoutAndRegister}
                className="ml-auto px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                退出登录
              </button>
            </div>
          )}
          
          {(error || showError) && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 mb-6">
              <AlertCircle className="w-5 h-5" />
              <span>
                {error || '请填写完整信息，密码至少6位，且两次输入一致'}
              </span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isEmailValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（至少6位）"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {password && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isPasswordValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isPasswordMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !isEmailValid || !isPasswordValid || !isPasswordMatch}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primaryLight}, ${currentTheme.primary})`
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  注册
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-center text-gray-500 mt-6">
            已有账户？{' '}
            <a 
              href="/login" 
              className="font-medium hover:underline"
              style={{ color: currentTheme.primary }}
            >
              立即登录
            </a>
          </p>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-400 text-sm">
              注册即表示您同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}