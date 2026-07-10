import { useState } from 'react';
import { ArrowLeft, Lock, Palette, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ThemeSelector } from '@/components/ThemeSelector';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

export function Settings() {
  const { updatePassword, error, loading, clearError } = useAuthStore();
  const { theme, colorMode, toggleColorMode } = useAppStore();
  const navigate = useNavigate();
  
  const currentTheme = themes[theme];
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  const handlePasswordChange = async () => {
    clearError();
    setShowPasswordError(false);
    setPasswordSuccess(false);
    
    if (newPassword !== confirmPassword) {
      setShowPasswordError(true);
      return;
    }
    
    if (newPassword.length < 6) {
      setShowPasswordError(true);
      return;
    }
    
    await updatePassword(newPassword);
    
    if (!error) {
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="pt-24 pb-8 px-4"
        style={{ backgroundColor: currentTheme.primary }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回个人中心</span>
          </button>
          
          <h1 className="text-2xl font-bold text-white">设置</h1>
          <p className="text-white/80 mt-2">管理您的账户和偏好设置</p>
        </div>
      </div>
      
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <ThemeSelector />
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">深色模式</h2>
              </div>
              <button
                onClick={toggleColorMode}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                  colorMode === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    colorMode === 'dark' ? 'left-8 bg-gray-600' : 'left-1 bg-white'
                  }`}
                >
                  {colorMode === 'dark' ? (
                    <Moon className="w-3 h-3 text-yellow-400" />
                  ) : (
                    <Sun className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {colorMode === 'dark' ? '已开启深色模式' : '已开启浅色模式'}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5" style={{ color: currentTheme.primary }} />
              <h2 className="text-lg font-semibold text-gray-800">修改密码</h2>
            </div>
            
            {passwordSuccess && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>密码修改成功</span>
              </div>
            )}
            
            {showPasswordError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>两次输入的密码不一致或密码长度不足</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少6位）"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryLight}, ${currentTheme.primary})`
                }}
              >
                {loading ? '修改中...' : '修改密码'}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5" style={{ color: currentTheme.primary }} />
              <h2 className="text-lg font-semibold text-gray-800">主题预览</h2>
            </div>
            
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white" />
                </div>
                <div className="text-white">
                  <div className="font-bold">资料核验</div>
                  <div className="text-white/70 text-sm">当前主题颜色效果</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: currentTheme.success }} />
              <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: currentTheme.warning }} />
              <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: currentTheme.danger }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>可信</span>
              <span>待验证</span>
              <span>不实</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}