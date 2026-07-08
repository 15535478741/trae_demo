import { useEffect } from 'react';
import { Shield, TrendingUp, Award, Clock } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { HistoryList } from '@/components/HistoryList';
import { useAppStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { checkContent } from '@/utils/api';
import { getCheckRecords } from '@/utils/supabase';
import { useNavigate } from 'react-router-dom';
import { themes } from '@/types';

export function Home() {
  const { 
    theme, 
    checkResults, 
    addCheckResult, 
    setCheckResults, 
    setCurrentResult, 
    isChecking, 
    setIsChecking 
  } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const currentTheme = themes[theme];
  
  useEffect(() => {
    const fetchRecords = async () => {
      if (isAuthenticated) {
        const records = await getCheckRecords();
        setCheckResults(records);
      }
    };
    fetchRecords();
  }, [isAuthenticated, setCheckResults]);
  
  const handleCheck = async (content: string, type: 'text' | 'url' | 'image' | 'document') => {
    setIsChecking(true);
    
    try {
      const result = await checkContent({ content, type });
      addCheckResult(result);
      setCurrentResult(result);
      
      if (isAuthenticated) {
        await import('@/utils/supabase').then(({ saveCheckRecord }) => {
          saveCheckRecord({
            content: result.content,
            content_type: result.content_type,
            accuracy_score: result.accuracy_score,
            source_reliability: result.source_reliability,
            verdict: result.verdict,
            confidence: result.confidence,
            analysis: result.analysis,
            sources: result.sources,
          });
        });
      }
      
      navigate(`/result/${result.id}`);
    } catch (error) {
      console.error('检测失败:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  const stats = [
    { icon: Shield, label: '已检测', value: '10,000+', color: currentTheme.primary },
    { icon: TrendingUp, label: '准确率', value: '95%', color: '#22c55e' },
    { icon: Award, label: '用户信任', value: '98%', color: '#eab308' },
    { icon: Clock, label: '平均耗时', value: '3秒', color: '#06b6d4' },
  ];
  
  return (
    <div className="min-h-screen">
      <section 
        className="pt-24 pb-16 px-4 text-center"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.primaryDark} 0%, ${currentTheme.primary} 50%, ${currentTheme.primaryLight} 100%)`,
          borderRadius: '0 0 4rem 4rem'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            资料真假性核验
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            快速辨别网络信息的真实性，让每一条资料都值得信赖
          </p>
          
          {isChecking ? (
            <LoadingSpinner size="lg" text="正在分析中..." />
          ) : (
            <SearchInput onSubmit={handleCheck} disabled={isChecking} />
          )}
        </div>
      </section>
      
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon 
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: stat.color }}
                />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <HistoryList results={checkResults} />
        </div>
      </section>
      
      <footer className="py-8 px-4 text-center text-gray-400 text-sm">
        <p>资料核验APP - 让信息更可信</p>
      </footer>
    </div>
  );
}