import { CheckCircle, XCircle, HelpCircle, Clock, ArrowRight, Trash2 } from 'lucide-react';
import type { CheckResult } from '@/types';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

interface ResultCardProps {
  result: CheckResult;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function ResultCard({ result, onClick, onDelete }: ResultCardProps) {
  const { theme } = useAppStore();
  const navigate = useNavigate();
  const currentTheme = themes[theme];
  
  const getVerdictIcon = () => {
    switch (result.verdict) {
      case 'true':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'false':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <HelpCircle className="w-6 h-6 text-yellow-400" />;
    }
  };
  
  const getVerdictText = () => {
    switch (result.verdict) {
      case 'true':
        return '属实';
      case 'false':
        return '不实';
      default:
        return '待验证';
    }
  };
  
  const getVerdictColor = () => {
    switch (result.verdict) {
      case 'true':
        return '#22c55e';
      case 'false':
        return '#ef4444';
      default:
        return '#eab308';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return date.toLocaleDateString('zh-CN');
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-btn')) return;
    
    if (onClick) {
      onClick();
    } else {
      navigate(`/result/${result.id}`);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(result.id);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${getVerdictColor()}15` }}
          >
            {getVerdictIcon()}
          </div>
          <div>
            <span 
              className="font-bold text-lg"
              style={{ color: getVerdictColor() }}
            >
              {getVerdictText()}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-3 h-3" />
              <span>{formatDate(result.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="delete-btn p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            title="删除记录"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {result.content}
      </p>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">准确性</span>
            <span className="font-bold" style={{ color: currentTheme.primary }}>
              {result.accuracy_score}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${result.accuracy_score}%`,
                backgroundColor: result.accuracy_score >= 70 ? '#22c55e' : result.accuracy_score >= 40 ? '#eab308' : '#ef4444'
              }}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">来源可靠</span>
            <span className="font-bold" style={{ color: currentTheme.primary }}>
              {result.source_reliability}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${result.source_reliability}%`,
                backgroundColor: result.source_reliability >= 70 ? '#22c55e' : result.source_reliability >= 40 ? '#eab308' : '#ef4444'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}