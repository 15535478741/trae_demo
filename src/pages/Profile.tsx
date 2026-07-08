import { User, Mail, Calendar, Settings, History, ChevronRight, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

export function Profile() {
  const { user } = useAuthStore();
  const { theme } = useAppStore();
  const navigate = useNavigate();
  
  const currentTheme = themes[theme];
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const menuItems = [
    { icon: Settings, label: '设置', path: '/settings', description: '修改密码、主题设置' },
    { icon: History, label: '检测记录', path: '/', description: '查看历史检测记录' },
    { icon: Shield, label: '隐私安全', path: '/settings', description: '账号安全设置' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="pt-24 pb-16 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.primaryDark} 0%, ${currentTheme.primary} 100%)`,
          borderRadius: '0 0 4rem 4rem'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">
                {user.username || user.email.split('@')[0]}
              </h1>
              <p className="text-white/80 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 -mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">账户信息</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">邮箱</p>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">注册时间</p>
                  <p className="text-gray-800 font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <Settings className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">当前主题</p>
                  <p className="text-gray-800 font-medium" style={{ color: currentTheme.primary }}>
                    {theme === 'blue' && '科技蓝'}
                    {theme === 'green' && '自然绿'}
                    {theme === 'purple' && '优雅紫'}
                    {theme === 'orange' && '活力橙'}
                    {theme === 'pink' && '温馨粉'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">功能菜单</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors text-left"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.primary}15` }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: currentTheme.primary }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">资料核验APP v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}