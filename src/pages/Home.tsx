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
        className="pt-24 pb-16 px-4 text-center hero-section"
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full animate-spin border-4 border-gray-200 border-t-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">正在进行多维度分析</h3>
              <div className="space-y-3">
                {[
                  { label: '文本解析与关键词提取', done: true },
                  { label: '来源可信度评估', done: true },
                  { label: '事实数据库匹配', done: false },
                  { label: '逻辑一致性检测', done: false },
                  { label: 'AI内容识别', done: false },
                  { label: '生成分析报告', done: false },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {step.done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${step.done ? 'text-gray-600' : 'text-gray-400'}`}>{step.label}</p>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${step.done ? 'bg-green-500' : 'bg-blue-400'}`}
                          style={{ width: step.done ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">TRAE正在智能分析中，请稍候...</p>
              </div>
            </div>
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